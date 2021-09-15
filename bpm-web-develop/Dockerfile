FROM harbor.qianfan123.com/base/hd_nginx:1.11.3-lua-alpine
LABEL PROJECT="hdbpm" \
      VERSION="0.0.1"        \
      AUTHOR="chenrizhang"    \
      COMPANY="Shanghai HEADING Information Engineering Co., Ltd."
WORKDIR /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/*
RUN mkdir /usr/share/nginx/html/bpm-web
ADD tower-build.tar.gz /usr/share/nginx/html/bpm-web
