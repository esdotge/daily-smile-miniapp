// public/app.js

// Simulación del SDK de Farcaster y datos del usuario
const mockFarcasterSDK = {
    context: async () => {
        // En una Mini App real, esto vendría del SDK con datos reales.
        // Para este MVP, simulamos un usuario.
        return {
            user: {
                fid: Math.floor(Math.random() * 10000) + 1,
                username: `user${Math.floor(Math.random() * 1000)}`,
                displayName: "Smiling User",
                pfpUrl: "https://i.imgur.com/user-placeholder.png" // Un placeholder
            }
        };
    },
    actions: {
        ready: () => console.log("Mini App MVP ready (simulated SDK)"),
    }
};

// Usa el SDK real si está disponible, sino el mock.
const sdk = window.farcasterSDK || mockFarcasterSDK;

document.addEventListener('DOMContentLoaded', async () => {
    const farcasterUserElement = document.getElementById('farcasterUser');
    const welcomeMessageElement = document.getElementById('welcomeMessage');
    const imageUploadInput = document.getElementById('imageUploadInput');
    const uploadButton = document.getElementById('uploadButton');
    const retakeButton = document.getElementById('retakeButton');
    const imageUploadArea = document.getElementById('imageUploadArea');
    const uploadedImagePreview = document.getElementById('uploadedImagePreview');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const rewardMessageElement = document.getElementById('rewardMessage');

    let currentUser = null;

    // 1. "Loguear" al usuario y mostrar su info
    try {
        if (sdk && sdk.actions && typeof sdk.actions.ready === 'function') {
            sdk.actions.ready();
        }
        
        const appContext = await sdk.context();
        if (appContext && appContext.user) {
            currentUser = appContext.user;
            farcasterUserElement.textContent = `${currentUser.displayName} (FID: ${currentUser.fid})`;
            welcomeMessageElement.textContent = `Hey ${currentUser.displayName}!`;
        } else {
            farcasterUserElement.textContent = "Guest";
            welcomeMessageElement.textContent = `Welcome, Guest!`;
            console.warn("Could not retrieve Farcaster user context.");
        }
    } catch (error) {
        console.error("Error getting Farcaster context:", error);
        farcasterUserElement.textContent = "Error loading user";
    }

    // 2. Lógica para el botón "Upload Smile"
    uploadButton.addEventListener('click', () => {
        // Si ya hay una imagen subida y confirmada, no hacer nada o dar un mensaje
        if (uploadedImagePreview.style.display !== 'none' && uploadButton.textContent === 'Confirm Smile') {
            // Lógica de confirmación
            rewardMessageElement.textContent = `Awesome, ${currentUser.displayName || 'User'}! You've earned 1 $MILE for your smile!`;
            uploadButton.style.display = 'none'; // Ocultar botón de confirmar
            retakeButton.style.display = 'inline-block'; // Mostrar botón de repetir
            retakeButton.textContent = 'Share Another Smile Tomorrow!';
            // Aquí, en una app real, se haría el check-in diario y el envío de token.
            // Por ahora, solo mostramos el mensaje.
            return;
        }
        // Si no, abrir el selector de archivos
        imageUploadInput.click();
    });

    // 3. Cuando se selecciona un archivo de imagen
    imageUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImagePreview.src = e.target.result;
                uploadedImagePreview.style.display = 'block';
                uploadPlaceholder.style.display = 'none'; // Ocultar placeholder
                rewardMessageElement.textContent = ''; // Limpiar mensaje de recompensa anterior
                
                uploadButton.textContent = 'Confirm Smile'; // Cambiar texto del botón
                retakeButton.style.display = 'inline-block'; // Mostrar botón de retake
                retakeButton.textContent = 'Retake / Choose Another';
            }
            reader.readAsDataURL(file);
        } else {
            // Reset si no es una imagen válida
            uploadedImagePreview.style.display = 'none';
            uploadPlaceholder.style.display = 'block';
            uploadButton.textContent = 'Upload Smile';
            retakeButton.style.display = 'none';
            alert("Please select a valid image file.");
        }
    });

    // 4. Lógica para el botón "Retake / New Smile"
    retakeButton.addEventListener('click', () => {
        if (retakeButton.textContent === 'Share Another Smile Tomorrow!') {
            // Lógica para el día siguiente (aquí solo reseteamos la UI)
             alert("Great job today! Come back tomorrow to share another smile and earn more $MILE!");
        }
        // Resetear la UI para una nueva subida
        imageUploadInput.value = null; // Para permitir subir la misma imagen si se quiere
        uploadedImagePreview.src = '#';
        uploadedImagePreview.style.display = 'none';
        uploadPlaceholder.style.display = 'block';
        uploadButton.textContent = 'Upload Smile';
        uploadButton.style.display = 'inline-block';
        retakeButton.style.display = 'none';
        rewardMessageElement.textContent = '';
    });
});