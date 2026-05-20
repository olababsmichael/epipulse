document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('epipulseReportForm');
  const locationInput = document.getElementById('location');
  
  // Internal state memory store to isolate geographic telemetry
  let geographicCoordinates = {
    latitude: null,
    longitude: null,
    accuracyMeters: null,
    capturedViaGPS: false
  };

  // Track operational input elements needing validation
  const fields = [
    { id: 'diseaseType', parentClass: 'input-node' },
    { id: 'severityLevel', parentClass: 'input-node' },
    { id: 'symptoms', parentClass: 'input-node' },
    { id: 'location', parentClass: 'input-node' },
    { id: 'dateOfOccurrence', parentClass: 'input-node' },
    { id: 'numAffected', parentClass: 'input-node' }
  ];

  // Initialize browser core Geolocation framework
  const triggerGeolocatorLookup = () => {
    if (!navigator.geolocation) {
      console.warn('Surveillance Warning: Geolocation API missing from terminal browser.');
      return;
    }

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        geographicCoordinates.latitude = position.coords.latitude;
        geographicCoordinates.longitude = position.coords.longitude;
        geographicCoordinates.accuracyMeters = position.coords.accuracy;
        geographicCoordinates.capturedViaGPS = true;

        console.log(`GPS Anchor Captured: [${geographicCoordinates.latitude}, ${geographicCoordinates.longitude}]`);
        
        // Visual indicator inline inside the text placeholder to inform the data team
        if (locationInput && !locationInput.value.includes('📍')) {
          locationInput.placeholder = `📍 Coordinates Locked (±${Math.round(geographicCoordinates.accuracyMeters)}m)`;
        }
      },
      (error) => {
        // Fallback gracefully to manual textual layout if telemetry tracking fails or is blocked
        console.warn(`Geographic link bypassed: Error Code ${error.code} - ${error.message}`);
      },
      geoOptions
    );
  };

  // Wire up GPS trigger immediately when user focuses or modifies the location string block
  if (locationInput) {
    locationInput.addEventListener('focus', triggerGeolocatorLookup, { once: true });
  }

  // Validate an individual node element
  const validateField = (fieldEl, parentNode) => {
    let isValid = true;

    if (!fieldEl.checkValidity()) {
      isValid = false;
    }
    
    if (fieldEl.type === 'number' && fieldEl.value !== '') {
      if (parseInt(fieldEl.value, 10) < 1) {
        isValid = false;
      }
    }

    if (!isValid) {
      parentNode.classList.add('invalid');
    } else {
      parentNode.classList.remove('invalid');
    }

    return isValid;
  };

  // Wire up dynamic event listeners for clean operational feedback
  fields.forEach(fieldConfig => {
    const fieldEl = document.getElementById(fieldConfig.id);
    if (!fieldEl) return;
    
    const parentNode = fieldEl.closest(`.${fieldConfig.parentClass}`);
    const changeEvent = fieldEl.tagName === 'SELECT' ? 'change' : 'blur';

    fieldEl.addEventListener(changeEvent, () => {
      validateField(fieldEl, parentNode);
    });

    fieldEl.addEventListener('input', () => {
      if (fieldEl.checkValidity()) {
        parentNode.classList.remove('invalid');
      }
    });
  });

  // Intercept data submission transmission channel
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isFormValid = true;

    fields.forEach(fieldConfig => {
      const fieldEl = document.getElementById(fieldConfig.id);
      if (fieldEl) {
        const parentNode = fieldEl.closest(`.${fieldConfig.parentClass}`);
        const isFieldValid = validateField(fieldEl, parentNode);
        if (!isFieldValid) {
          isFormValid = false;
        }
      }
    });

    if (isFormValid) {
      // Build structured cryptographic data payload structure with appended geospatial telemetry
      const payload = {
        disease: document.getElementById('diseaseType').value,
        severity: document.getElementById('severityLevel').value,
        symptoms: document.getElementById('symptoms').value,
        locationText: locationInput.value,
        spatialCoordinates: { ...geographicCoordinates }, // Attaches tracking coordinates securely here
        date: document.getElementById('dateOfOccurrence').value,
        casesAffected: parseInt(document.getElementById('numAffected').value, 10),
        supplementaryNotes: document.getElementById('comments').value || null,
        timestamp: new Date().toISOString()
      };

      console.log('Telemetry Packet Transmitted successfully:', payload);
      
      alert(`Report submitted successfully for ${payload.disease}. Location ${payload.spatialCoordinates.capturedViaGPS ? 'confirmed' : 'not available'}.`);
      
      // Clean up internal positional caches on reset
      geographicCoordinates = { latitude: null, longitude: null, accuracyMeters: null, capturedViaGPS: false };
      if (locationInput) locationInput.placeholder = "e.g., Ward, LGA, Village";
      
      form.reset();
    } else {
      const firstInvalidNode = document.querySelector('.input-node.invalid');
      if (firstInvalidNode) {
        firstInvalidNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  form.addEventListener('reset', () => {
    geographicCoordinates = { latitude: null, longitude: null, accuracyMeters: null, capturedViaGPS: false };
    if (locationInput) locationInput.placeholder = "e.g., Ward, LGA, Village";

    fields.forEach(fieldConfig => {
      const fieldEl = document.getElementById(fieldConfig.id);
      if (fieldEl) {
        const parentNode = fieldEl.closest(`.${fieldConfig.parentClass}`);
        if (parentNode) {
          parentNode.classList.remove('invalid');
        }
      }
    });
  });
});