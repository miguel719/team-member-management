FROM python:3.11-slim

# Instalar herramientas necesarias y netcat
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc build-essential netcat-openbsd && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /code

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .
