from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

def analizar_cv_local():
    # 1. Cargamos tus archivos
    try:
        with open("data/mi_cv.txt", "r") as f:
            cv = f.read()
        with open("data/oferta.txt", "r") as f:
            oferta = f.read()
    except FileNotFoundError:
        print("❌ Error: Asegurate de tener mi_cv.txt y oferta.txt en la carpeta data/.")
        return

    # 2. El modelo local
    llm = OllamaLLM(model="llama3")

    # 3. El Prompt (instrucciones)
    template = """
    Eres un Tech Recruiter experto. Compara este CV con la Oferta Laboral.
    
    CV: {cv_texto}
    OFERTA: {oferta_texto}
    
    Proporciona:
    1. Porcentaje de coincidencia.
    2. Habilidades faltantes.
    3. Una sugerencia para mejorar el perfil.
    """
    
    prompt = ChatPromptTemplate.from_template(template)
    chain = prompt | llm

    print("🚀 Analizando localmente... (esto puede tardar un poquito en CPU)")
    
    # 4. Ejecución
    respuesta = chain.invoke({"cv_texto": cv, "oferta_texto": oferta})
    
    print("\n" + "="*40)
    print("📊 RESULTADO DEL ANÁLISIS")
    print("="*40)
    print(respuesta)

if __name__ == "__main__":
    analizar_cv_local()
    