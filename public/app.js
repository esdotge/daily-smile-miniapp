// public/app.js

// Intenta acceder al SDK de Farcaster Mini Apps inyectado por el cliente (ej. Warpcast)
const sdk = window.farcasterSDK; 

document.addEventListener('DOMContentLoaded', async () => {
    const farcasterUserElement = document.getElementById('farcasterUser');
    const welcomeMessageElement = document.getElementById('welcomeMessage');
    const imageUploadInput = document.getElementById('imageUploadInput');
    const uploadButton = document.getElementById('uploadButton');
    const retakeButton = document.getElementById('retakeButton');
    // const imageUploadArea = document.getElementById('imageUploadArea'); // Ya no se usa directamente para cambiar contenido
    const uploadedImagePreview = document.getElementById('uploadedImagePreview');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const rewardMessageElement = document.getElementById('rewardMessage');

    let currentUser = null;

    function showMessage(message, type = 'info') {
        rewardMessageElement.textContent = message;
        // Podrías añadir clases para diferentes tipos de mensajes si quieres
        // rewardMessageElement.className = `reward-message ${type}`;
    }

    // 1. Notificar que la Mini App está lista y obtener el contexto del usuario
    try {
        if (sdk && sdk.actions && typeof sdk.actions.ready === 'function') {
            await sdk.actions.ready(); // Espera a que la acción se complete si es asíncrona
            console.log("Daily Smile Mini App reported as ready to Farcaster client.");
        } else {
            console.warn("Farcaster SDK not fully available for 'ready' action. Proceeding with mock data if SDK context is also missing.");
        }
        
        if (sdk && sdk.context && typeof sdk.context === 'function') {
            const appContext = await sdk.context();
            console.log("Farcaster App Context:", appContext); // Para depuración

            if (appContext && appContext.user) {
                currentUser = appContext.user;
                // Usamos fid como fallback si displayName o username no están.
                const displayName = currentUser.displayName || currentUser.username || `FID: ${currentUser.fid}`;
                farcasterUserElement.textContent = `FID: ${currentUser.fid}`; // Mostrar FID siempre es útil
                welcomeMessageElement.textContent = `Hey ${displayName}!`;
            } else {
                // Fallback si no se puede obtener el usuario del SDK
                farcasterUserElement.textContent = "Guest (SDK context error)";
                welcomeMessageElement.textContent = `Welcome, Guest!`;
                console.warn("Could not retrieve Farcaster user from SDK context.");
            }
        } else {
            // Fallback si el SDK o sdk.context no está disponible en absoluto
            farcasterUserElement.textContent = "Guest (SDK not found)";
            welcomeMessageElement.textContent = `Welcome, Guest!`;
            console.warn("Farcaster SDK or sdk.context function not found.");
        }
    } catch (error) {
        console.error("Error initializing Farcaster context or SDK ready:", error);
        farcasterUserElement.textContent = "Error loading user";
        welcomeMessageElement.textContent = `Welcome!`; // Mensaje genérico en caso de error
    }

    // 2. Lógica para el botón "Upload Smile"
    uploadButton.addEventListener('click', () => {
        const currentButtonText = uploadButton.textContent;

        if (currentButtonText === 'Confirm Smile') {
            // Lógica de confirmación
            const userNameToDisplay = currentUser ? (currentUser.displayName || currentUser.username || `FID: ${currentUser.fid}`) : 'User';
            showMessage(`Awesome, ${userNameToDisplay}! You've earned 1 $MILE for your smile! (Simulated)`);
            
            uploadButton.style.display = 'none'; 
            retakeButton.style.display = 'inline-block'; 
            retakeButton.textContent = 'Share Another Smile Tomorrow!';
            // Aquí no se guarda nada en backend para este MVP, solo UI.
        } else { // El botón dice "Upload Smile"
            imageUploadInput.click(); // Abrir el selector de archivos
        }
    });

    // 3. Cuando se selecciona un archivo de imagen
    imageUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImagePreview.src = e.target.result;
                uploadedImagePreview.style.display = 'block';
                if (uploadPlaceholder) uploadPlaceholder.style.display = 'none'; 
                showMessage(''); // Limpiar mensaje de recompensa anterior
                
                uploadButton.textContent = 'Confirm Smile'; 
                retakeButton.style.display = 'inline-block'; 
                retakeButton.textContent = 'Retake / Choose Another';
            }
            reader.readAsDataURL(file);
        } else {
            // Reset si no es una imagen válida
            uploadedImagePreview.style.display = 'none';
            if (uploadPlaceholder) uploadPlaceholder.style.display = 'block';
            uploadButton.textContent = 'Upload Smile';
            retakeButton.style.display = 'none';
            if (file) { // Solo muestra alerta si se intentó seleccionar un archivo
                 alert("Please select a valid image file (e.g., JPG, PNG).");
            }
        }
    });

    // 4. Lógica para el botón "Retake / New Smile" o "Share Another Smile Tomorrow!"
    retakeButton.addEventListener('click', () => {
        if (retakeButton.textContent === 'Share Another Smile Tomorrow!') {
             alert("Great job today! Come back tomorrow to share another smile and earn more $MILE! (This is a simulation)");
        }
        // Resetear la UI para una nueva subida
        imageUploadInput.value = null; 
        uploadedImagePreview.src = '#';
        uploadedImagePreview.style.display = 'none';
        if (uploadPlaceholder) uploadPlaceholder.style.display = 'block';
        uploadButton.textContent = 'Upload Smile';
        uploadButton.style.display = 'inline-block';
        retakeButton.style.display = 'none';
        showMessage('');
    });
});
