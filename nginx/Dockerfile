FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY script.sh /script.sh

# ENTRYPOINT [ "sh", "/script.sh" ]
ENTRYPOINT ["nginx", "-g", "daemon off;"]