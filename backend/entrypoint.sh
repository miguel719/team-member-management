#!/bin/bash
echo "Wait DB"
while ! nc -z db 5432; do
  sleep 0.5
done

echo "Executing migrations..."
python manage.py migrate


echo "start server..."
python manage.py runserver 0.0.0.0:8000
