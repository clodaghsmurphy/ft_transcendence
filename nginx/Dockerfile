FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf

# ENTRYPOINT [ "sh", "/script.sh" ]
ENTRYPOINT ["nginx", "-g", "daemon off;"]