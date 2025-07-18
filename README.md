# 🚀 Chatbot AI con React e n8n

Una chat AI completa con interfaccia in stile macOS, supporto per messaggi testuali e vocali, integrata con n8n per l'automazione backend.

## 📺 Tutorial YouTube

Questo repository accompagna il tutorial YouTube su come creare una chat AI professionale da zero.

## ✨ Caratteristiche

- 🎨 **Design macOS autentico** con effetti glassmorphism
- 💬 **Messaggi testuali** con parsing intelligente delle risposte
- 🎤 **Messaggi vocali** con registrazione e trascrizione automatica
- 🔄 **Integrazione n8n** per automazione backend
- 📱 **Responsive design** per desktop e mobile
- ⚡ **Real-time** con feedback visivo e animazioni fluide

## 🛠️ Requisiti

### Software necessario:
- **Node.js** (versione 16 o superiore)
- **npm** o **yarn**
- **Account OpenAI** con API key
- **Istanza n8n** (cloud o self-hosted)

### Conoscenze consigliate:
- Basi di React e TypeScript
- Familiarità con n8n
- Concetti base di API REST

## 🚀 Installazione

### 1. Clona il repository
```bash
git clone https://github.com/dylanpatriarchi/chatbot-ai-yt.git
cd chatbot-ai-yt
```

### 2. Installa le dipendenze
```bash
npm install
```

### 3. Configura n8n

#### Importa il workflow:
1. Vai su n8n
2. Crea un nuovo workflow
3. Importa il file `n8n/workflow.json`
4. Configura le credenziali OpenAI

#### Personalizza il prompt:
1. Apri i nodi "Prompt Audio" e "Prompt Testo"
2. Sostituisci i placeholder con i tuoi dati:
   - `[YOUR COMPANY NAME]` → Nome della tua azienda
   - `[YOUR EMAIL]` → La tua email
   - `[YOUR INSTAGRAM]` → Il tuo account Instagram
   - `[PRICE RANGE]` → I tuoi prezzi
   - `[SERVICE DESCRIPTION]` → Descrizione dei tuoi servizi

### 4. Configura le credenziali OpenAI in n8n

1. Vai su **Credentials** in n8n
2. Aggiungi una nuova credenziale **OpenAI**
3. Inserisci la tua API key OpenAI
4. Salva e collega ai nodi OpenAI nel workflow

### 5. Ottieni l'URL del webhook

1. Attiva il workflow in n8n
2. Copia l'URL del webhook dal nodo "Input Audio"
3. Aggiorna l'URL nell'app React

### 6. Aggiorna l'URL API nell'app React

Modifica il file `src/components/ChatWindow.tsx`:

```typescript
// Cerca questa riga (appare 2 volte):
const response = await fetch('https://TUO-N8N-URL/webhook-test/audio-input', {
```

### 7. Avvia l'applicazione

```bash
npm start
```

L'app sarà disponibile su `http://localhost:3000`

## 🎯 Come funziona

### Architettura del sistema:

```
React App → n8n Webhook → OpenAI API → Risposta JSON → React App
```

### Flusso dei messaggi:

1. **Messaggio testuale**:
   - L'utente scrive un messaggio
   - Viene inviato come `FormData` con campo `prompt`
   - n8n elabora con OpenAI
   - Ritorna JSON: `{"response": "..."}`

2. **Messaggio vocale**:
   - L'utente registra audio
   - Viene inviato come `FormData` con campo `file` (input.m4a)
   - n8n trascrivi con OpenAI Whisper
   - Elabora il testo trascritto
   - Ritorna JSON: `{"response": "..."}`

## 🔧 Personalizzazione

### Modifica i colori:
Edita `src/components/ChatWidget.css` e `src/components/ChatWindow.css`

### Cambia l'icona:
Sostituisci le icone in `src/components/ChatWidget.tsx` con quelle di `lucide-react`

### Personalizza il prompt AI:
Modifica il contenuto nei nodi "Prompt Audio" e "Prompt Testo" in n8n

### Aggiungi nuove funzionalità:
- Estendi il workflow n8n
- Aggiungi nuovi componenti React
- Integra database per storico conversazioni

## 📁 Struttura del progetto

```
chatbot-ai-yt/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ChatWidget.tsx      # Widget principale
│   │   ├── ChatWidget.css      # Stili widget
│   │   ├── ChatWindow.tsx      # Finestra chat
│   │   └── ChatWindow.css      # Stili finestra
│   ├── App.tsx                 # Componente principale
│   ├── App.css                 # Stili globali app
│   ├── index.tsx               # Entry point
│   └── index.css               # Stili globali
├── n8n/
│   └── workflow.json           # Workflow n8n template
├── package.json                # Dipendenze
└── README.md                   # Questa guida
```

## 🎨 Caratteristiche del design

### Stile macOS:
- Effetti glassmorphism con `backdrop-filter`
- Controlli finestra tipici (rosso/giallo)
- Animazioni fluide con curve di Bézier iOS
- Tipografia San Francisco (system font)

### Responsive:
- Desktop: Finestra flottante 380x500px
- Mobile: Fullscreen automatico
- Icona adattiva con hover effects

### Accessibilità:
- Supporto tastiera (Enter per inviare)
- ARIA labels per screen reader
- Contrasti colore conformi WCAG

## 🔍 Troubleshooting

### Errore "Risposta ricevuta!" invece del messaggio:
- Verifica che l'URL webhook sia corretto
- Controlla che il workflow n8n sia attivo
- Verifica la struttura JSON di risposta

### Errore microfono:
- Controlla i permessi del browser
- Usa HTTPS in produzione
- Verifica compatibilità MediaRecorder

### Errore CORS:
- Configura CORS in n8n
- Usa proxy in development se necessario

## 🚀 Deploy in produzione

### Frontend (Vercel/Netlify):
```bash
npm run build
# Carica la cartella build/
```

### Backend (n8n):
- Usa n8n Cloud o self-hosted
- Configura HTTPS per webhook
- Imposta variabili ambiente per API keys

## 🤝 Contribuire

1. Fork il repository
2. Crea un branch per la tua feature
3. Commit le modifiche
4. Push al branch
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi il file `LICENSE` per dettagli.

## 🙏 Ringraziamenti

- OpenAI per l'API GPT e Whisper
- n8n per la piattaforma di automazione
- Lucide per le icone
- La community React per l'ispirazione

---

⭐ **Se questo progetto ti è stato utile, lascia una stella su GitHub!**

🔔 **Iscriviti al canale YouTube per altri tutorial!** 