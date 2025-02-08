// src/scripts/chat.js

// Seleciona os elementos do DOM
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatContainer = document.getElementById('chatContainer');

// Função para adicionar mensagens na tela
function appendMessage(sender, message) {
  const messageDiv = document.createElement('div');
  // Define o estilo: mensagens do usuário à direita, do atendimento à esquerda
  messageDiv.className = sender === 'Você' ? 'text-right my-2' : 'text-left my-2';
  messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatContainer.appendChild(messageDiv);
  // Rola o container para mostrar a mensagem mais recente
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Event listener para o envio do formulário
chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;
  
  // Exibe a mensagem do usuário
  appendMessage('Você', userMessage);
  chatInput.value = '';

  try {
    // Envia a mensagem para o agente n8n via requisição POST
    const response = await fetch('https://marcinholub.app.n8n.cloud/webhook/bb922a6a-746f-45e0-a0fc-6f0f9e5f7be5/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });

    if (response.ok) {
      const data = await response.json();
      // Supondo que a resposta da IA seja retornada na propriedade "reply"
      const botMessage = data.reply || "Desculpe, não entendi.";
      appendMessage('Atendimento', botMessage);
    } else {
      appendMessage('Atendimento', 'Erro ao enviar a mensagem. Tente novamente.');
    }
  } catch (error) {
    console.error('Erro na conexão:', error);
    appendMessage('Atendimento', 'Erro de conexão. Verifique sua rede.');
  }
});
// src/scripts/chat-toggle.js

// Seleciona os elementos do DOM responsáveis pelo toggle do chat
const chatToggleButton = document.getElementById('chatToggleButton');
const chatModal = document.getElementById('chatModal');
const closeChatButton = document.getElementById('closeChatButton');

// Função para alternar a visibilidade do chat
function toggleChat() {
  chatModal.classList.toggle('hidden');
}

// Listener para o botão flutuante de ativação do chat
chatToggleButton.addEventListener('click', toggleChat);

// Listener para o botão de fechar no componente de chat
if (closeChatButton) {
  closeChatButton.addEventListener('click', toggleChat);
}
