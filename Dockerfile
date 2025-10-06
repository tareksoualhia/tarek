# Utilise une image Python officielle
FROM python:3.10-slim

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers requirements
COPY requirements.txt .


# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste du projet
COPY . .

# Copy entrypoint and make executable
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Exposer le port de Django
EXPOSE 8000



# Use entrypoint to run migrations and start server
ENTRYPOINT ["/entrypoint.sh"]
CMD ["bash"]