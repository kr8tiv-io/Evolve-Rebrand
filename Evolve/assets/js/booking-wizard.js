// === EVOLVE BOOKING WIZARD ===
// Global Smart Modal for Multi-Step Contact Form

// State Management
const wizardState = {
    currentStep: 1,
    totalSteps: 3,
    projectType: null,
    timeline: null,
    serviceType: null,
    files: []
};

// Wait for DOM to be ready
let modal, modalContainer, closeBtn, steps, stepIndicators, nextBtn, backBtn, submitBtn;

// Open Modal Function (Available Immediately)
function openModal() {
    if (!modal) {
        modal = document.getElementById('booking-modal');
    }
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        console.error('Booking modal not found!');
    }
}

// Expose globally immediately
window.openBookingModal = openModal;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    modal = document.getElementById('booking-modal');
    modalContainer = document.querySelector('.modal-container');
    closeBtn = document.querySelector('.modal-close');
    steps = document.querySelectorAll('.wizard-step');
    stepIndicators = document.querySelectorAll('.step-indicator');
    nextBtn = document.getElementById('wizard-next');
    backBtn = document.getElementById('wizard-back');
    submitBtn = document.getElementById('wizard-submit');
    
    if (!modal) {
        console.error('Booking modal element not found in DOM');
        return;
    }

// Close Modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    resetWizard();
}

// Reset Wizard
function resetWizard() {
    wizardState.currentStep = 1;
    wizardState.projectType = null;
    wizardState.timeline = null;
    wizardState.serviceType = null;
    wizardState.files = [];
    updateStep();
    document.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
    document.getElementById('booking-form').reset();
    document.getElementById('preview-container').innerHTML = '';
}

// Update Step Display
function updateStep() {
    // Hide all steps
    steps.forEach(step => step.classList.remove('active'));
    
    // Show current step
    steps[wizardState.currentStep - 1].classList.add('active');
    
    // Update indicators
    stepIndicators.forEach((indicator, index) => {
        if (index < wizardState.currentStep) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
    
    // Update navigation buttons
    backBtn.style.display = wizardState.currentStep === 1 ? 'none' : 'flex';
    
    if (wizardState.currentStep === wizardState.totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'flex';
    } else {
        nextBtn.style.display = 'flex';
        submitBtn.style.display = 'none';
    }
    
    validateStep();
}

// Validate Current Step
function validateStep() {
    let isValid = false;
    
    switch(wizardState.currentStep) {
        case 1:
            isValid = wizardState.projectType && wizardState.timeline;
            break;
        case 2:
            const address = document.getElementById('location-input').value;
            isValid = address.length > 0 && wizardState.serviceType;
            break;
        case 3:
            const name = document.getElementById('contact-name').value;
            const phone = document.getElementById('contact-phone').value;
            const email = document.getElementById('contact-email').value;
            isValid = name.length > 0 && phone.length > 0 && email.length > 0;
            break;
    }
    
    nextBtn.disabled = !isValid;
    submitBtn.disabled = !isValid;
}

// Next Step
function nextStep() {
    if (wizardState.currentStep < wizardState.totalSteps) {
        wizardState.currentStep++;
        updateStep();
    }
}

// Previous Step
function prevStep() {
    if (wizardState.currentStep > 1) {
        wizardState.currentStep--;
        updateStep();
    }
}

// Handle Option Selection
function selectOption(type, value) {
    if (type === 'project') {
        wizardState.projectType = value;
        document.querySelectorAll('[data-type="project"]').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-type="project"][data-value="${value}"]`).classList.add('selected');
    } else if (type === 'timeline') {
        wizardState.timeline = value;
        document.querySelectorAll('[data-type="timeline"]').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-type="timeline"][data-value="${value}"]`).classList.add('selected');
    } else if (type === 'service') {
        wizardState.serviceType = value;
        document.querySelectorAll('[data-type="service"]').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-type="service"][data-value="${value}"]`).classList.add('selected');
    }
    validateStep();
}

// Expose globally for onclick handlers
window.selectOption = selectOption;

// File Upload Handling
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const previewContainer = document.getElementById('preview-container');

dropZone.addEventListener('click', () => fileInput.click());

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
});

dropZone.addEventListener('drop', handleDrop, false);
fileInput.addEventListener('change', handleFiles, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles({ target: { files: files } });
}

function handleFiles(e) {
    const files = [...e.target.files];
    const filesToProcess = files.slice(0, 5 - wizardState.files.length);
    
    filesToProcess.forEach(file => {
        wizardState.files.push(file);
        previewFile(file);
    });
}

function previewFile(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
        const img = document.createElement('img');
        img.src = reader.result;
        img.classList.add('preview-thumb');
        previewContainer.appendChild(img);
    }
}

// Form Submission
function handleSubmit(e) {
    e.preventDefault();
    
    const formData = {
        projectType: wizardState.projectType,
        timeline: wizardState.timeline,
        serviceType: wizardState.serviceType,
        address: document.getElementById('location-input').value,
        details: document.getElementById('project-details').value,
        specialCircumstances: document.getElementById('special-circumstances').value,
        name: document.getElementById('contact-name').value,
        phone: document.getElementById('contact-phone').value,
        email: document.getElementById('contact-email').value,
        files: wizardState.files
    };
    
    console.log('Form Data:', formData);
    
    // TODO: Send to backend/API
    // For now, just show success and close
    alert('Thank you! Your request has been submitted. We\'ll contact you within 2 hours.');
    closeModal();
}

// Event Listeners
if (closeBtn) closeBtn.addEventListener('click', closeModal);
if (modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});
if (nextBtn) nextBtn.addEventListener('click', nextStep);
if (backBtn) backBtn.addEventListener('click', prevStep);

const bookingForm = document.getElementById('booking-form');
if (bookingForm) bookingForm.addEventListener('submit', handleSubmit);

// Input validation listeners
const locationInput = document.getElementById('location-input');
const contactName = document.getElementById('contact-name');
const contactPhone = document.getElementById('contact-phone');
const contactEmail = document.getElementById('contact-email');

if (locationInput) locationInput.addEventListener('input', validateStep);
if (contactName) contactName.addEventListener('input', validateStep);
if (contactPhone) contactPhone.addEventListener('input', validateStep);
if (contactEmail) contactEmail.addEventListener('input', validateStep);

}); // End DOMContentLoaded

// Google Maps Autocomplete (initialized after Maps API loads)
window.initAutocomplete = function() {
    const input = document.getElementById("location-input");
    const options = {
        fields: ["formatted_address", "geometry", "name"],
        strictBounds: false,
    };

    const autocomplete = new google.maps.places.Autocomplete(input, options);

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        
        if (place.geometry && place.geometry.location) {
            input.style.borderColor = '#39FF14';
            validateStep();
        }
    });
}
