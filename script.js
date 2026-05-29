// document.addEventListener('DOMContentLoaded', () => {
//   const form = document.getElementById('epipulseReportForm');
//   const locationInput = document.getElementById('location');
  
//   // Internal state memory store to isolate geographic telemetry
//   let geographicCoordinates = {
//     latitude: null,
//     longitude: null,
//     accuracyMeters: null,
//     capturedViaGPS: false
//   };

//   // Track operational input elements needing validation
//   const fields = [
//     { id: 'diseaseType', parentClass: 'input-node' },
//     { id: 'severityLevel', parentClass: 'input-node' },
//     { id: 'symptoms', parentClass: 'input-node' },
//     { id: 'location', parentClass: 'input-node' },
//     { id: 'dateOfOccurrence', parentClass: 'input-node' },
//     { id: 'numAffected', parentClass: 'input-node' }
//   ];

//   // Initialize browser core Geolocation framework
//   const triggerGeolocatorLookup = () => {
//     if (!navigator.geolocation) {
//       console.warn('Surveillance Warning: Geolocation API missing from terminal browser.');
//       return;
//     }

//     const geoOptions = {
//       enableHighAccuracy: true,
//       timeout: 8000,
//       maximumAge: 0
//     };

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         geographicCoordinates.latitude = position.coords.latitude;
//         geographicCoordinates.longitude = position.coords.longitude;
//         geographicCoordinates.accuracyMeters = position.coords.accuracy;
//         geographicCoordinates.capturedViaGPS = true;

//         console.log(`GPS Anchor Captured: [${geographicCoordinates.latitude}, ${geographicCoordinates.longitude}]`);
        
//         // Visual indicator inline inside the text placeholder to inform the data team
//         if (locationInput && !locationInput.value.includes('📍')) {
//           locationInput.placeholder = `📍 Coordinates Locked (±${Math.round(geographicCoordinates.accuracyMeters)}m)`;
//         }
//       },
//       (error) => {
//         // Fallback gracefully to manual textual layout if telemetry tracking fails or is blocked
//         console.warn(`Geographic link bypassed: Error Code ${error.code} - ${error.message}`);
//       },
//       geoOptions
//     );
//   };

//   // Wire up GPS trigger immediately when user focuses or modifies the location string block
//   if (locationInput) {
//     locationInput.addEventListener('focus', triggerGeolocatorLookup, { once: true });
//   }

//   // Validate an individual node element
//   const validateField = (fieldEl, parentNode) => {
//     let isValid = true;

//     if (!fieldEl.checkValidity()) {
//       isValid = false;
//     }
    
//     if (fieldEl.type === 'number' && fieldEl.value !== '') {
//       if (parseInt(fieldEl.value, 10) < 1) {
//         isValid = false;
//       }
//     }

//     if (!isValid) {
//       parentNode.classList.add('invalid');
//     } else {
//       parentNode.classList.remove('invalid');
//     }

//     return isValid;
//   };

//   // Wire up dynamic event listeners for clean operational feedback
//   fields.forEach(fieldConfig => {
//     const fieldEl = document.getElementById(fieldConfig.id);
//     if (!fieldEl) return;
    
//     const parentNode = fieldEl.closest(`.${fieldConfig.parentClass}`);
//     const changeEvent = fieldEl.tagName === 'SELECT' ? 'change' : 'blur';

//     fieldEl.addEventListener(changeEvent, () => {
//       validateField(fieldEl, parentNode);
//     });

//     fieldEl.addEventListener('input', () => {
//       if (fieldEl.checkValidity()) {
//         parentNode.classList.remove('invalid');
//       }
//     });
//   });

//   // Intercept data submission transmission channel
//   form.addEventListener('submit', (e) => {
//     e.preventDefault();
//     let isFormValid = true;

//     fields.forEach(fieldConfig => {
//       const fieldEl = document.getElementById(fieldConfig.id);
//       if (fieldEl) {
//         const parentNode = fieldEl.closest(`.${fieldConfig.parentClass}`);
//         const isFieldValid = validateField(fieldEl, parentNode);
//         if (!isFieldValid) {
//           isFormValid = false;
//         }
//       }
//     });

//     if (isFormValid) {
//       // Build structured cryptographic data payload structure with appended geospatial telemetry
//       const payload = {
//         disease: document.getElementById('diseaseType').value,
//         severity: document.getElementById('severityLevel').value,
//         symptoms: document.getElementById('symptoms').value,
//         locationText: locationInput.value,
//         spatialCoordinates: { ...geographicCoordinates }, // Attaches tracking coordinates securely here
//         date: document.getElementById('dateOfOccurrence').value,
//         casesAffected: parseInt(document.getElementById('numAffected').value, 10),
//         supplementaryNotes: document.getElementById('comments').value || null,
//         timestamp: new Date().toISOString()
//       };

//       console.log('Telemetry Packet Transmitted successfully:', payload);
      
//       alert(`Report submitted successfully for ${payload.disease}. Location ${payload.spatialCoordinates.capturedViaGPS ? 'confirmed' : 'not available'}.`);
      
//       // Clean up internal positional caches on reset
//       geographicCoordinates = { latitude: null, longitude: null, accuracyMeters: null, capturedViaGPS: false };
//       if (locationInput) locationInput.placeholder = "e.g., Ward, LGA, Village";
      
//       form.reset();
//     } else {
//       const firstInvalidNode = document.querySelector('.input-node.invalid');
//       if (firstInvalidNode) {
//         firstInvalidNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       }
//     }
//   });

//   form.addEventListener('reset', () => {
//     geographicCoordinates = { latitude: null, longitude: null, accuracyMeters: null, capturedViaGPS: false };
//     if (locationInput) locationInput.placeholder = "e.g., Ward, LGA, Village";

//     fields.forEach(fieldConfig => {
//       const fieldEl = document.getElementById(fieldConfig.id);
//       if (fieldEl) {
//         const parentNode = fieldEl.closest(`.${fieldConfig.parentClass}`);
//         if (parentNode) {
//           parentNode.classList.remove('invalid');
//         }
//       }
//     });
//   });
// });
// Geolocation logic to get user lat/long
// ==========================================
// 1. SUPABASE INITIALIZATION

// ==========================================
// 1. SUPABASE INITIALIZATION (FIXED NAMESPACE)
// ==========================================
const SUPABASE_URL = "https://uaajsijjnmmbavleynry.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhYWpzaWpqbm1tYmF2bGV5bnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMzQ0NjQsImV4cCI6MjA5NDcxMDQ2NH0.eJwPlcUvMOyw2UME6N-prnD934btdqQNqgB5pWgB4uU"; 

// NOTICE: We changed 'const supabase' to 'const supabaseClient' 
// to stop it from clashing with the CDN library name!
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// ==========================================
// 2. GEOLOCATION LOGIC (Updated to Sync with Input Fields)
// ==========================================
// Run this on page load to limit the calendar to past/current dates
document.getElementById('symptomStartDate').max = new Date().toISOString().split("T")[0];
document.getElementById('geoTriggerBtn').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        
        // State simulation safeguard: Autofills Yabatech coordinates if you are outside Lagos
        if (lat < 6.3 || lat > 6.7 || lng < 3.2 || lng > 3.5) {
          lat = 6.5195;
          lng = 3.3748;
        }

        // Update the manual input values visually
        document.getElementById('manualLat').value = lat;
        document.getElementById('manualLng').value = lng;
        
        const locationInput = document.getElementById('location');
        locationInput.value = `📍 Coordinates Set`;
        locationInput.dataset.lat = lat;
        locationInput.dataset.lng = lng;
      },
      () => { 
        alert("GPS offline. Manually type your coordinates into the input boxes.");
      }
    );
  }
});


// ==========================================
// 3. FORM SUBMISSION LOGIC (Reads Manual Coordinates Directly)
// ==========================================
// document.getElementById('epipulseReportForm').addEventListener('submit', async function(e) {
//   e.preventDefault(); 

//   if (typeof supabaseClient === 'undefined') {
//     alert("CRITICAL ERROR: Supabase client initialization missing at the top of the file.");
//     return;
//   }

//   // Read directly from what you typed into the number boxes
//   let userLat = parseFloat(document.getElementById('manualLat').value);
//   let userLng = parseFloat(document.getElementById('manualLng').value);

//   // If you didn't type anything but used the crosshair, pull from the datasets
//   if (isNaN(userLat) || isNaN(userLng)) {
//     userLat = parseFloat(document.getElementById('location').dataset.lat);
//     userLng = parseFloat(document.getElementById('location').dataset.lng);
//   }

//   // Final check: Error out if both manual and dataset options are completely empty
//   if (isNaN(userLat) || isNaN(userLng)) {
//     alert("Please enter a valid Latitude and Longitude for Yaba, or tap the crosshair icon.");
//     return;
//   }
  
//   const numSick = document.getElementById('numAffected').value;

//   // Gather selected symptoms
//   const checkedBoxes = document.querySelectorAll('input[name="symptoms"]:checked');
//   let symptomList = [];
//   checkedBoxes.forEach(cb => symptomList.push(cb.value));

//   if (symptomList.length === 0) {
//     alert("Please check at least one symptom to help us assess your status.");
//     return;
//   }

//   // Clinical triage rating logic
//   let severityStatus = "MODERATE RISK";
//   let medicalAdvice = "Start drinking clean water mixed with Oral Rehydration Salts (ORS) immediately while moving to the facility.";
  
//   if (symptomList.includes("Watery Diarrhea") && symptomList.length >= 3) {
//     severityStatus = "CRITICAL / HIGH RISK (SUSPECTED CHOLERA OUTBREAK)";
//     medicalAdvice = "CRITICAL EMERGENCY. Give Oral Rehydration Salts (ORS) continuously. Proceed to the medical facility immediately. Do not delay.";
//   }

//   try {
//     // Call Supabase RPC using the cleanly extracted coordinates
//     const { data, error } = await supabaseClient.rpc('get_nearest_hospital', {
//       user_lat: userLat,
//       user_lng: userLng
//     });

//     if (error) throw error;
    
//     if (!data || data.length === 0) {
//       alert("Database connected successfully, but no Yaba hospitals were found matching that calculation cluster.");
//       return;
//     }

//     const closestHospital = data[0];
//     renderMedicalBreakdownPage(closestHospital, symptomList, severityStatus, medicalAdvice, numSick);

//   } catch (err) {
//     console.error("Database Connection Debug Details:", err);
//     alert("Database Connection Failed: " + (err.message || "Unknown error"));
//   }
// });

// // ==========================================
// // 4. SUMMARY UI RENDERING FUNCTION
// // ==========================================
// function renderMedicalBreakdownPage(hospital, symptoms, severity, advice, count) {
//   const workspace = document.querySelector('.workspace-card');
  
//   // Create stylized string of symptoms
//   const symptomBadges = symptoms.map(s => `<span style="background: #f1f5f9; padding: 5px 12px; border-radius: 20px; font-size: 0.9rem; font-weight: 500; border: 1px solid #cbd5e1;">${s}</span>`).join(' ');

//   // Rewrite workspace container HTML entirely so form vanishes clean
//   workspace.innerHTML = `
//     <div class="doctor-handout-wrapper" style="padding: 10px; font-family: 'Inter', sans-serif;">
      
//       <div style="background: ${severity.includes('CRITICAL') ? '#fef2f2' : '#fffbeb'}; border-left: 5px solid ${severity.includes('CRITICAL') ? '#ef4444' : '#f59e0b'}; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
//         <h3 style="margin: 0; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: ${severity.includes('CRITICAL') ? '#991b1b' : '#92400e'};">Assessment Result</h3>
//         <p style="margin: 5px 0 0 0; font-weight: 700; font-size: 1.1rem; color: ${severity.includes('CRITICAL') ? '#b91c1c' : '#b45309'};">${severity}</p>
//       </div>

//       <div style="border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; background: #fafafa; margin-bottom: 25px; position: relative;">
//         <span style="position: absolute; top: -12px; right: 15px; background: #00d2c4; color: white; padding: 2px 10px; font-size: 0.75rem; font-weight: 700; border-radius: 4px; text-transform: uppercase;">Triage Slip</span>
        
//         <h2 style="margin: 0 0 15px 0; font-size: 1.2rem; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;"><i class="fa-solid fa-notes-medical"></i> EpiPulse Clinical Summary</h2>
        
//         <p style="margin: 8px 0; font-size: 0.95rem; color: #334155;"><strong>Suspected Disease Profile:</strong> Acute Watery Diarrhea / Cholera</p>
//         <p style="margin: 8px 0; font-size: 0.95rem; color: #334155;"><strong>Total Cases Reported:</strong> ${count} Person(s)</p>
        
//         <div style="margin: 15px 0 10px 0;">
//           <strong style="display: block; margin-bottom: 8px; font-size: 0.95rem; color: #334155;">Reported Presenting Symptoms:</strong>
//           <div style="display: flex; flex-wrap: wrap; gap: 8px;">${symptomBadges}</div>
//         </div>
//       </div>

//       <div style="margin-bottom: 25px;">
//         <h4 style="margin: 0 0 5px 0; font-size: 0.9rem; text-transform: uppercase; color: #64748b;">Closest Hospital (Yaba Network)</h4>
//         <p style="margin: 0; font-weight: 700; font-size: 1.2rem; color: #0f172a;">${hospital.name}</p>
//         <p style="margin: 4px 0 0 0; color: #475569; font-size: 0.95rem;"><i class="fa-solid fa-location-dot" style="color: #00d2c4;"></i> ${hospital.address} (${hospital.distance_km.toFixed(2)} km away)</p>
//       </div>

//       <div style="background: #f0fdfa; border: 1px solid #ccfbf1; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
//         <strong style="color: #115e59; font-size: 0.95rem; display: block; margin-bottom: 4px;"><i class="fa-solid fa-hand-holding-droplet"></i> Immediate Action Plan:</strong>
//         <p style="margin: 0; font-size: 0.95rem; color: #14532d; line-height: 1.5;">${advice}</p>
//       </div>

//       <button onclick="window.location.reload();" class="btn-secondary" style="width: 100%; justify-content: center; padding: 12px; font-weight: 600;">
//         <i class="fa-solid fa-rotate-left"></i> Log Another Case Report
//       </button>

//     </div>
//   `;
// }
document.getElementById('epipulseReportForm').addEventListener('submit', async function(e) {
  e.preventDefault(); 

  if (typeof supabaseClient === 'undefined') {
    alert("CRITICAL ERROR: Supabase client initialization missing.");
    return;
  }

  // Read coordinates
  let userLat = parseFloat(document.getElementById('manualLat').value);
  let userLng = parseFloat(document.getElementById('manualLng').value);
  const numSick = document.getElementById('numAffected').value;
  
  // 1. Grab the onset date value
  const startDate = document.getElementById('symptomStartDate').value;

  if (!startDate) {
    alert("Please select the date the symptoms first started.");
    return;
  }
  if (isNaN(userLat) || isNaN(userLng)) {
    userLat = parseFloat(document.getElementById('location').dataset.lat);
    userLng = parseFloat(document.getElementById('location').dataset.lng);
  }
  if (isNaN(userLat) || isNaN(userLng)) {
    alert("Please provide location coordinates before submitting.");
    return;
  }

  // Gather selected symptoms
  const checkedBoxes = document.querySelectorAll('input[name="symptoms"]:checked');
  let symptomList = [];
  checkedBoxes.forEach(cb => symptomList.push(cb.value));

  if (symptomList.length === 0) {
    alert("Please check at least one symptom.");
    return;
  }

  // Clinical triage rating logic
  let severityStatus = "MODERATE RISK";
  let medicalAdvice = "Start drinking clean water mixed with Oral Rehydration Salts (ORS) immediately while moving to the facility.";
  
  if (symptomList.includes("Watery Diarrhea") && symptomList.length >= 3) {
    severityStatus = "CRITICAL / HIGH RISK (SUSPECTED CHOLERA OUTBREAK)";
    medicalAdvice = "CRITICAL EMERGENCY. Give Oral Rehydration Salts (ORS) continuously. Proceed to the medical facility immediately. Do not delay.";
  }

  try {
    const { data, error } = await supabaseClient.rpc('get_nearest_hospital', {
      user_lat: userLat,
      user_lng: userLng
    });

    if (error) throw error;
    if (!data || data.length === 0) {
      alert("Database connected, but no Yaba hospitals were found matching that calculation cluster.");
      return;
    }

    const closestHospital = data[0];

    // 2. Pass the startDate variable safely into the renderer
    renderMedicalBreakdownPage(closestHospital, symptomList, severityStatus, medicalAdvice, numSick, startDate);

  } catch (err) {
    console.error(err);
    alert("Database Connection Failed.");
  }
});

// 3. Updated Renderer Function to include Date and Print Section
function renderMedicalBreakdownPage(hospital, symptoms, severity, advice, count, dateObserved) {
  const workspace = document.querySelector('.workspace-card');
  
  // Format the date neatly for presentation (e.g., May 29, 2026)
  const formattedDate = new Date(dateObserved).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const symptomBadges = symptoms.map(s => `<span style="background: #f1f5f9; padding: 5px 12px; border-radius: 20px; font-size: 0.9rem; font-weight: 500; border: 1px solid #cbd5e1; display: inline-block; margin: 2px;">${s}</span>`).join(' ');

  workspace.innerHTML = `
    <div class="doctor-handout-wrapper printable-area" style="padding: 10px; font-family: 'Inter', sans-serif;">
      
      <div style="background-color: ${severity.includes('CRITICAL') ? '#fef2f2' : '#fffbeb'} !important; border-left: 5px solid ${severity.includes('CRITICAL') ? '#ef4444' : '#f59e0b'} !important; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
        <h3 style="margin: 0; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: ${severity.includes('CRITICAL') ? '#991b1b' : '#92400e'};">Assessment Result</h3>
        <p style="margin: 5px 0 0 0; font-weight: 700; font-size: 1.1rem; color: ${severity.includes('CRITICAL') ? '#b91c1c' : '#b45309'};">${severity}</p>
      </div>

      <div style="border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; background: #fafafa; margin-bottom: 25px; position: relative;">
        <span style="position: absolute; top: -12px; right: 15px; background: #00d2c4; color: white; padding: 2px 10px; font-size: 0.75rem; font-weight: 700; border-radius: 4px; text-transform: uppercase;">Triage Slip</span>
        
        <h2 style="margin: 0 0 15px 0; font-size: 1.2rem; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;"><i class="fa-solid fa-notes-medical"></i> EpiPulse Clinical Summary</h2>
        
        <p style="margin: 8px 0; font-size: 0.95rem; color: #334155;"><strong>Suspected Disease Profile:</strong> Acute Watery Diarrhea / Cholera</p>
        <p style="margin: 8px 0; font-size: 0.95rem; color: #334155;"><strong>Total Cases Reported:</strong> ${count} Person(s)</p>
        
        <p style="margin: 8px 0; font-size: 0.95rem; color: #334155;"><strong>Symptom Onset Date:</strong> <span style="color: #b91c1c; font-weight: 600;">${formattedDate}</span></p>
        
        <div style="margin: 15px 0 10px 0;">
          <strong style="display: block; margin-bottom: 8px; font-size: 0.95rem; color: #334155;">Reported Presenting Symptoms:</strong>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">${symptomBadges}</div>
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <h4 style="margin: 0 0 5px 0; font-size: 0.9rem; text-transform: uppercase; color: #64748b;">Closest Referral Center</h4>
        <p style="margin: 0; font-weight: 700; font-size: 1.2rem; color: #0f172a;">${hospital.name}</p>
        <p style="margin: 4px 0 0 0; color: #475569; font-size: 0.95rem;"><i class="fa-solid fa-location-dot" style="color: #00d2c4;"></i> ${hospital.address} (${hospital.distance_km.toFixed(2)} km away)</p>
      </div>

      <div style="background: #f0fdfa; border: 1px solid #ccfbf1; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
        <strong style="color: #115e59; font-size: 0.95rem; display: block; margin-bottom: 4px;"><i class="fa-solid fa-hand-holding-droplet"></i> Immediate Action Plan:</strong>
        <p style="margin: 0; font-size: 0.95rem; color: #14532d; line-height: 1.5;">${advice}</p>
      </div>

      <div style="display: flex; gap: 15px;" class="non-printable-actions">
        <button onclick="window.print();" class="btn-primary" style="flex: 1; justify-content: center; padding: 12px; font-weight: 600; background-color: #0284c7; border-color: #0284c7;">
          <i class="fa-solid fa-print"></i> Print Triage Slip
        </button>
        <button onclick="window.location.reload();" class="btn-secondary" style="flex: 1; justify-content: center; padding: 12px; font-weight: 600;">
          <i class="fa-solid fa-rotate-left"></i> New Report
        </button>
      </div>

    </div>
  `;
}