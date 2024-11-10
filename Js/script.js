// Retrieve departmentSerials from localStorage or initialize
let departmentSerials = JSON.parse(
  localStorage.getItem("departmentSerials")
) || {
  NUR: 1,
  PHA: 1,
  LAB: 1,
  RAD: 1,
  SUR: 1,
  PED: 1,
  OBS: 1,
  DEN: 1,
  PH: 1,
  PHY: 1,
  EM: 1,
  CAR: 1,
  NEU: 1,
  ORT: 1,
  ANE: 1,
};

// Display departmentSerials on page load for debugging
console.log("Loaded department serials:", departmentSerials);

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("Dashboard.html")) {
    // Modal for quick registration
    const registerIntern = document.querySelector("#registerIntern");
    const registerhospital = document.querySelector("#registerhospital");
    const registerInstitution = document.querySelector("#registerInstitution");

    if (registerIntern) {
      registerIntern.addEventListener("click", openModal);
    }

    if (registerhospital) {
      registerhospital.addEventListener("click", openModal);
    }
    if (registerInstitution) {
      registerInstitution.addEventListener("click", openModal);
    }
    document
      .querySelector(".close-model")
      .addEventListener("click", () => closeModel());

    function openModal() {
      const registerModal = document.querySelector("#register-model");
      registerModal.style.display = "flex";
    }

    function closeModel() {
      const registerModal = document.querySelector("#register-model");
      registerModal.style.display = "none";
    }

    window.onclick = function (event) {
      const registerModal = document.querySelector("#register-model");
      if (event.target == registerModal) {
        closeModel();
      }
    };

    // Intern registration form element selections
    const InternRegisterForm = document.getElementById("InternRegister");
    const InternfullName = document.getElementById("fullName");
    const InternmotherName = document.getElementById("mothername");
    const dateoFBirth = document.getElementById("dateoFBirth");
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    const martialStatus = document.querySelectorAll(
      'input[name="martialStatus"]'
    );
    const InternNationality = document.getElementById("nationality");
    const InternAddresss = document.getElementById("addresss");
    const InternEmail = document.getElementById("email");
    const InternPhonenumber = document.getElementById("phonenumber");
    const departmentDropdown = document.getElementById("Department");
    const IntenID = document.getElementById("IntenID");
    const InternInstitution = document.getElementById("Institution");
    const StartDate = document.getElementById("StartDate");
    const EndDate = document.getElementById("EndDate");
    const InternImage = document.getElementById("InternImage");
    const RegisterFormBtn = document.getElementById("RegisterFormBtn");

    // Function to get selected gender
    function getSelectedGender() {
      let selectedGender = "";
      genderRadios.forEach((radio) => {
        if (radio.checked) {
          selectedGender = radio.value;
        }
      });
      return selectedGender;
    }

    // Function to get selected marital status
    function getSelectedMaritalStatus() {
      let selectedStatus = "";
      martialStatus.forEach((radio) => {
        if (radio.checked) {
          selectedStatus = radio.value;
        }
      });
      return selectedStatus;
    }

    // Function to update the ID input when department changes
    departmentDropdown.addEventListener("change", function () {
      const selectedDepartment = departmentDropdown.value;
      const serial = departmentSerials[selectedDepartment];
      IntenID.value = `${selectedDepartment}${String(serial).padStart(3, "0")}`;
    });

    // Function to handle image conversion to Base64
    function getImageBase64(imageFile) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }

    // Function to save intern data
    async function saveInternData() {
      const selectedDepartment = departmentDropdown.value;
      const serial = departmentSerials[selectedDepartment]; // Get the current serial

      // Set the ID using the department code and current serial
      IntenID.value = `${selectedDepartment}${String(serial).padStart(3, "0")}`;

      const internData = {
        fullName: InternfullName.value,
        motherName: InternmotherName.value,
        dateOfBirth: dateoFBirth.value,
        gender: getSelectedGender(),
        maritalStatus: getSelectedMaritalStatus(),
        nationality: InternNationality.value,
        address: InternAddresss.value,
        email: InternEmail.value,
        phoneNumber: InternPhonenumber.value,
        department: selectedDepartment,
        internID: IntenID.value,
        institution: InternInstitution.value,
        startDate: StartDate.value,
        endDate: EndDate.value,
        image: InternImage.files[0]
          ? await getImageBase64(InternImage.files[0])
          : null,
      };

      let interns = JSON.parse(localStorage.getItem("interns")) || [];
      interns.push(internData);
      localStorage.setItem("interns", JSON.stringify(interns));

      // Increment and save the updated serial in localStorage
      departmentSerials[selectedDepartment]++;
      localStorage.setItem(
        "departmentSerials",
        JSON.stringify(departmentSerials)
      );

      alert("Intern registered successfully!");
      InternRegisterForm.reset();
    }

    // Event listener for form submission
    InternRegisterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      saveInternData();
      window.location.href = "../Html/Interns.html";
    });

    // dashboard metrix
    // Total Intenrs Count
    let interns = JSON.parse(localStorage.getItem("interns"));

    const totalInternsValue = document.querySelector("#TotalInternsValue");
    const pendingInternsValue = document.querySelector("#pendingInternsValue");
    const activeInternsValue = document.querySelector("#activeInternsValue");
    const completedInternsValue = document.querySelector(
      "#completedInternsValue"
    );

    function updateTotalInterns() {
      const totalInterns = interns.length;

      // Filter interns by status to get counts for Active, Pending, and Completed
      const activeInterns = interns.filter(
        (intern) => intern.status === "Active"
      ).length;
      const pendingInterns = interns.filter(
        (intern) => intern.status === "Pending"
      ).length;
      const completedInterns = interns.filter(
        (intern) => intern.status === "Completed"
      ).length;

      totalInternsValue.textContent = totalInterns;
      pendingInternsValue.textContent = pendingInterns;
      activeInternsValue.textContent = activeInterns;
      completedInternsValue.textContent = completedInterns;
    }
    // Run the function to display the data when the dashboard loads
    updateTotalInterns();

    let hospitals = JSON.parse(localStorage.getItem("hospitals")) || [];
    // Create a mapping of hospital IDs to intern counts
    let hospitalInternCounts = hospitals.map((hospital) => {
      // Filter interns based on SelectedHospitalID
      let internCount = interns.filter(
        (intern) => intern.SelectedHospitalID === hospital.id
      ).length;

      // Debugging statement to check each hospital's intern count
      console.log(
        `Hospital: ${hospital.hospitalName}, Intern Count: ${internCount}`
      );

      return {
        name: hospital.hospitalName,
        count: internCount,
        capacity: hospital.hospitalCapacity,
      };
    });

    // Check if hospitalInternCounts has correct data
    console.log("hospitalInternCounts:", hospitalInternCounts);

    // Prepare data for the chart
    let hospitalLabels = hospitalInternCounts.map((item) => item.name);
    let internData = hospitalInternCounts.map((item) => item.count);
    let capacityData = hospitalInternCounts.map((item) => item.capacity);

    // Create Hospital Bar Chart
    new Chart(document.getElementById("hospitalBarChart"), {
      type: "bar",
      data: {
        labels: hospitalLabels,
        datasets: [
          {
            label: "Interns",
            backgroundColor: "#18c15e",
            data: internData,
          },
          {
            label: "Capacity",
            backgroundColor: "#406ed9",
            data: capacityData,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          xAxes: [
            {
              display: true,
              barPercentage: 0.7,
            },
          ],
          yAxes: [
            {
              display: true,
              ticks: { beginAtZero: true },
            },
          ],
        },
        legend: {
          position: "top",
        },
      },
    });

    // gender based chart
    // Filter and count genders (only Male and Female)
    let maleCount = 0;
    let femaleCount = 0;

    interns.forEach((intern) => {
      if (intern.gender === "male") {
        maleCount++;
      } else if (intern.gender === "female") {
        femaleCount++;
      }
    });

    // Data and labels for the Doughnut Chart
    const genderData = {
      labels: ["Male", "Female"],
      datasets: [
        {
          data: [maleCount, femaleCount],
          backgroundColor: ["#4e73df", "#f6c23e"], // Colors for Male and Female
          hoverBackgroundColor: ["#2e59d9", "#d4b106"], // Hover colors
        },
      ],
    };

    // Doughnut Chart options
    const genderChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    };

    // Render the Doughnut Chart
    const ctx = document.getElementById("genderDoughnutChart").getContext("2d");
    new Chart(ctx, {
      type: "doughnut",
      data: genderData,
      options: genderChartOptions,
    });
  }

  if (window.location.pathname.includes("Interns.html")) {
    function updateInternStatuses() {
      let interns = JSON.parse(localStorage.getItem("interns")) || [];
      const currentDate = new Date();

      interns = interns.map((intern) => {
        let status = intern.status;

        if (
          intern.startDate &&
          new Date(intern.startDate) <= currentDate &&
          status !== "Completed"
        ) {
          status = "Active"; 
        }
        if (intern.endDate && new Date(intern.endDate) <= currentDate) {
          status = "Completed"; 
        }

        return { ...intern, status };
      });

      localStorage.setItem("interns", JSON.stringify(interns));
    }
    updateInternStatuses();
     const departmentNames = {
       NUR: "Nursing",
       PHA: "Pharmacy",
       LAB: "Laboratory",
       RAD: "Radiology",
       SUR: "Surgery",
       PED: "Pediatrics",
       OBS: "Obstetrics",
       DEN: "Dentistry",
       PH: "Public Health",
       PHY: "Physiotherapy",
       EM: "Emergency Medicine",
       CAR: "Cardiology",
       NEU: "Neurology",
       ORT: "Orthopedics",
       ANE: "Anesthesiology",
     };

     const tableBody = document.getElementById("InternsTableBody");
     const RegisteredInterns = JSON.parse(localStorage.getItem("interns")) || [];
     RegisteredInterns.forEach((intern) => {
       const row = document.createElement("tr");
       row.innerHTML = `
        <td>${intern.internID}</td>
        <td>${intern.fullName}</td>
        <td>${intern.institution}</td>
        <td>${departmentNames[intern.department]}</td>
        <td>${intern.startDate}</td>
        <td>${intern.endDate}</td>
         <td><span class="status">${
         intern.status
       }</span></td>`;

       // Add a click event to the row to open modal with intern details
       row.addEventListener("click", () => {
         openInternModal(intern);
       });
       tableBody.appendChild(row);
     });

     const modal = document.getElementById("internModal");
     const modalImage = document.getElementById("InternImagModal");
     const InstinLogo = document.getElementById("InstinLogo");
     const HospitalLogo = document.getElementById("HospitalLogo");
     const modalFullName = document.getElementById("modalFullName");
     const modalMotherName = document.getElementById("modalMotherName");
     const modalDateOfBirth = document.getElementById("modalDateOfBirth");
     const modalGender = document.getElementById("modalGender");
     const modalMaritalStatus = document.getElementById("modalMaritalStatus");
     const modalNationality = document.getElementById("modalNationality");
     const modalAddress = document.getElementById("modalAddress");
     const modalEmail = document.getElementById("modalEmail");
     const modalPhoneNumber = document.getElementById("modalPhoneNumber");
     const modalDepartment = document.getElementById("modalDepartment");
     const modalInstitution = document.getElementById("modalInstitution");
     const ModalSelectedHospital = document.getElementById("ModalSelectedHospital");
     const modalStartDate = document.getElementById("modalStartDate");
     const modalEndDate = document.getElementById("modalEndDate");
     const modalStatus = document.getElementById("modalStatus");

     function openInternModal(intern) {
      console.log("Opening Modal:", intern);
      const hospitals = JSON.parse(localStorage.getItem("hospitals")) || [];
      // const institutions = JSON.parse(localStorage.getItem("institutions")) || [];

      const hospital = hospitals.find(h => h.id === intern.SelectedHospitalID);
      // const institution = institutions.find(i => i.id === intern.institutionID);
      


       // Populate modal with intern data
       modalImage.src = intern.image || "../Images/default-profile-image.png";
      //  InstinLogo.src = institution.InstitLogo || "../Images/Universitydefault-logo.png";
      HospitalLogo.src = hospital.hospitalLogo || "../Images/defaultHospitalLogo.jpg";
      modalFullName.textContent = intern.fullName;
      modalMotherName.textContent = intern.motherName;
      modalDateOfBirth.textContent = intern.dateOfBirth;
      modalGender.textContent = intern.gender;
      modalMaritalStatus.textContent = intern.maritalStatus;
      modalNationality.textContent = intern.nationality;
      modalAddress.textContent = intern.address;
      modalEmail.textContent = intern.email;
      modalPhoneNumber.textContent = intern.phoneNumber; 
      modalDepartment.textContent = departmentNames[intern.department];
      modalInstitution.textContent = intern.institution;
      ModalSelectedHospital.textContent = hospital
       ? hospital.hospitalName
       : "Unknown Hospital";
      modalStartDate.textContent = intern.startDate;
      modalEndDate.textContent = intern.endDate;
      modalStatus.textContent = intern.status || "Pending"; // default status

      modal.style.display = "block";
     }

     // Close modal functionality
     document
       .querySelector("#CloseInternModal")
       .addEventListener("click", function () {
         modal.style.display = "none";
       });

     // Close modal when clicking outside of it
     window.onclick = function (event) {
       if (event.target == modal) {
         modal.style.display = "none";
       }
     };
}

if (window.location.pathname.includes("Hospitals.html")) {

  const HospitalTableBody = document.getElementById("HospitalTableBody");
  const registeredHospitals = JSON.parse(localStorage.getItem("hospitals")) || [];
  const registeredInterns = JSON.parse(localStorage.getItem("interns")) || [];

  registeredHospitals.forEach((hospital) => {
    const internCount = registeredInterns.filter(
      (intern) => intern.SelectedHospitalID === hospital.id
    ).length;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${hospital.id}</td>
      <td>${hospital.hospitalName}</td>
      <td>${hospital.hospitalsdepartment}</td> 
      <td>${hospital.hospitalType}</td>
      <td>${hospital.hospitalCapacity}</td>
      <td>${hospital.availableShifts}</td>
      <td>${internCount}</td>
    `;

    // Add click event to show hospital details modal
    row.addEventListener("click", () => {
      console.log("Hospital row clicked");
      openHospitalDetailsModal(hospital, internCount);
    });
    HospitalTableBody.appendChild(row);
  });


  const CloseHospitalModal = document.getElementById("CloseHospitalModal");
  const HospitalModal = document.getElementById("HospitalModal");

  const HospitalLogo = document.getElementById("HospitalLogo");
  const HospNAMEModal = document.getElementById("HospNAMEModal");
  const HospitalIDmodal = document.getElementById("HospitalIDmodal");
  const HospitalTypeMOdal = document.getElementById("HospitalTypeMOdal");
  const HospitalCapaModal = document.getElementById("HospitalCapaModal");
  const modalHosDepartments = document.getElementById("modalHosDepartments");
  const modalHosShifts = document.getElementById("modalHosShifts");
  const modalHosPhone = document.getElementById("modalHosPhone");
  const modalHosEmail = document.getElementById("modalHosEmail");
  const HospitalAddressModal = document.getElementById("HospitalAddressModal");
  const InternsReceivedModal = document.getElementById("InternsReceivedModal");

  function openHospitalDetailsModal(hospital, internCount) {
    HospitalLogo.src = hospital.hospitalLogo || "../Images/defaultHospitalLogo.jpg";
    HospNAMEModal.textContent = hospital.hospitalName;
    HospitalIDmodal.textContent = hospital.id;
    HospitalTypeMOdal.textContent = hospital.hospitalType;
    HospitalCapaModal.textContent = hospital.hospitalCapacity;
    modalHosDepartments.textContent = hospital.hospitalsdepartment;
    modalHosShifts.textContent = hospital.availableShifts;
    modalHosPhone.textContent = hospital.hospitalPhone;
    modalHosEmail.textContent = hospital.hospitalEmail;
    HospitalAddressModal.textContent = hospital.hospitallocation;
    InternsReceivedModal.textContent = internCount;

    HospitalModal.style.display = "block";
  }

  CloseHospitalModal.addEventListener("click", () => {
    HospitalModal.style.display = "none";
  });

  window.onclick = function (event) {
       if (event.target == HospitalModal) {
         HospitalModal.style.display = "none";
       }
  }

}

});
