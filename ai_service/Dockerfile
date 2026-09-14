FROM python:3.11-slim

WORKDIR /app

# تثبيت متطلبات الاعتماديات أولاً لاستغلال الـ Cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# نسخ باقي الكود
COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]