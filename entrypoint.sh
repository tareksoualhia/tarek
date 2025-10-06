#!/bin/sh
set -e

# Make wait script executable and wait for DB
if [ -f /app/wait-for-db.sh ]; then
  chmod +x /app/wait-for-db.sh
  /app/wait-for-db.sh ${DJANGO_DB_HOST:-db} ${DJANGO_DB_PORT:-5432}
fi

# Apply migrations
echo "Applying migrations..."
python manage.py migrate --noinput

# Start the Django development server
exec python manage.py runserver 0.0.0.0:8000