{ pkgs, ... }:

{
  packages = with pkgs; [
    bash
    bun
    cacert
    coreutils
    ffmpeg
    findutils
    gcc
    glibc
    gnugrep
    python313Packages.fonttools
    python313Packages.brotli
    unzip
  ];

  env.NODE_ENV = "development";

  enterShell = ''
    export PATH="$DEVENV_ROOT/scripts:$PATH"
    GCC_RUNTIME_LIB="$(dirname "$(gcc -print-file-name=libstdc++.so.6)")"
    export LD_LIBRARY_PATH="$GCC_RUNTIME_LIB''${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
  '';
}
