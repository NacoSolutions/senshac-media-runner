{
  description = "Senshac media processor rootless OCI image";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  outputs = { self, nixpkgs, ... }:
    let
      systems = [ "x86_64-linux" ];
      forEachSystem = f: nixpkgs.lib.genAttrs systems (system: f (import nixpkgs { inherit system; }));
    in {
      packages = forEachSystem (pkgs:
        let
          nodeModules = pkgs.stdenvNoCC.mkDerivation (finalAttrs: {
            pname = "senshac-media-runner-node-modules";
            version = "1";
            src = ./.;
            offlineCache = pkgs.fetchYarnDeps {
              yarnLock = ./yarn.lock;
              hash = "sha256-2k1bn207/oZaC+YMvK4DfvWO226EmxeMnk5Oyiu2PKM=";
            };
            nativeBuildInputs = [ pkgs.yarnConfigHook pkgs.yarn ];
            dontBuild = true;
            installPhase = ''
              mkdir -p $out
              cp -a node_modules $out/
            '';
          });
          runtime = pkgs.buildEnv {
            name = "senshac-media-runner-runtime";
            paths = with pkgs; [ bash bun cacert coreutils ffmpeg findutils gnugrep gcc (python313.withPackages (p: [ p.fonttools p.brotli ])) nodeModules ];
            pathsToLink = [ "/bin" "/lib" "/etc" ];
          };
          app = pkgs.runCommand "senshac-media-runner-app" {} ''
            mkdir -p $out/opt/senshac-media-runner/scripts
            cp -r ${./scripts}/. $out/opt/senshac-media-runner/scripts/
            cp ${./package.json} $out/opt/senshac-media-runner/package.json
            ln -s ${nodeModules}/node_modules $out/opt/senshac-media-runner/node_modules
            chmod +x $out/opt/senshac-media-runner/scripts/media-runner $out/opt/senshac-media-runner/scripts/media/process-video.sh
          '';
          ociImage = pkgs.dockerTools.buildLayeredImage {
            name = "senshac-media-runner";
            tag = "candidate";
            contents = [ runtime app pkgs.glibc ];
            extraCommands = ''
              mkdir -p ./usr/bin ./usr/lib ./lib64 ./etc ./opt/python-site ./tmp ./work/input ./work/output
              ln -s ${pkgs.coreutils}/bin/env ./usr/bin/env
              ln -sf ${pkgs.glibc}/lib/ld-linux-x86-64.so.2 ./lib64/ld-linux-x86-64.so.2
              for module in ${pkgs.python313.withPackages (p: [ p.fonttools p.brotli ])}/lib/python3.13/site-packages/*; do ln -s "$module" ./opt/python-site/; done
              printf '%s\n' 'root:x:0:0:root:/root:/bin/bash' 'runner:x:1000:1000:Senshac Media Runner:/tmp:/bin/bash' > ./etc/passwd
              printf '%s\n' 'root:x:0:' 'runner:x:1000:' > ./etc/group
              printf '%s\n' 'passwd: files' 'group: files' 'hosts: files dns' > ./etc/nsswitch.conf
              chmod 1777 ./tmp
            '';
            fakeRootCommands = ''
              chown 1000:1000 ./work/input ./work/output
              chown 0:0 ./tmp
            '';
            config = {
              User = "1000:1000";
              WorkingDir = "/opt/senshac-media-runner";
              Entrypoint = [ "/opt/senshac-media-runner/scripts/media-runner" ];
              Cmd = [ "help" ];
              Env = [
                "PATH=/bin:/usr/bin:${runtime}/bin"
                "HOME=/tmp"
                "TMPDIR=/tmp"
                "XDG_CONFIG_HOME=/tmp/.config"
                "LD_LIBRARY_PATH=${pkgs.gcc.cc.lib}/lib"
                "PYTHONPATH=/opt/python-site"
                "SSL_CERT_FILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
                "NIX_SSL_CERT_FILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
                "NODE_EXTRA_CA_CERTS=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
              ];
            };
          };
        in { inherit runtime nodeModules app ociImage; default = ociImage; });
    };
}
