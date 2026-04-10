# AI Career Analyzer 🚀
Analizador de compatibilidad laboral usando **LLMs locales** (Llama 3) y **LangChain**.

## 🧠 Sobre el Proyecto
Este proyecto nació para automatizar el análisis de vacantes IT, comparando el perfil de un desarrollador Full Stack contra ofertas reales. Utiliza **Ollama** para correr modelos locales, garantizando privacidad total y costo cero.

## 🛠️ Stack Tecnológico
- **Python 3.12**
- **LangChain** (Orquestación de LLM)
- **Ollama** (Motor de inferencia local)
- **Docker** (Contenerización)

## 🚀 Cómo correrlo
1. Levantar el servicio de IA:
   `docker-compose up -d`
2. Descargar el modelo:
   `docker exec -it ollama_service ollama run llama3`
3. Instalar dependencias:
   `pip install -r requirements.txt`
4. Ejecutar el análisis:
   `python src/analizador.py`