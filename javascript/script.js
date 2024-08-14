document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('studentForm'); // Reference to the student registration form
    const studentList = document.getElementById('studentList'); // Reference to the div where students will be listed
    let students = JSON.parse(localStorage.getItem('students')) || []; // Retrieve students from local storage or initialize an empty array

    // Function to render the list of registered students on the students.html page
    function renderStudents() {
        if (studentList) {
            studentList.innerHTML = ''; // Clear the existing list
            if (students.length > 0) {
                const table = document.createElement('table'); // Create a new table element
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Student ID</th>
                            <th>Email ID</th>
                            <th>Contact No</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                `;
                const tbody = document.createElement('tbody'); // Create the table body
                students.forEach((student, index) => {
                    const row = document.createElement('tr'); // Create a new row for each student
                    row.innerHTML = `
                        <td>${student.name}</td>
                        <td>${student.id}</td>
                        <td>${student.email}</td>
                        <td>${student.contact}</td>
                        <td>
                            <button class="edit" data-index="${index}">Edit</button>
                            <button class="delete" data-index="${index}">Delete</button>
                        </td>
                    `;
                    tbody.appendChild(row); // Append the row to the table body
                });
                table.appendChild(tbody); // Append the table body to the table
                studentList.appendChild(table); // Append the table to the studentList div
            } else {
                studentList.innerHTML = '<p>No students registered.</p>'; // Display a message if no students are registered
            }
        }
    }

    // Function to find duplicates in student ID, email, or contact number
    function findDuplicates(studentId, emailId, contact) {
        let duplicateFields = [];
        students.forEach(student => {
            if (student.id === studentId) duplicateFields.push('Student ID');
            if (student.email === emailId) duplicateFields.push('Email ID');
            if (student.contact === contact) duplicateFields.push('Contact No');
        });
        return duplicateFields; // Return an array of fields that have duplicates
    }

    // Function to validate input fields
    function validateInputs(name, id, email, contact) {
        const namePattern = /^[a-zA-Z\s]+$/; // Regex pattern for names (letters and spaces)
        const idPattern = /^\d+$/; // Regex pattern for student ID (numbers only)
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Regex pattern for email
        const contactPattern = /^\d+$/; // Regex pattern for contact number (numbers only)

        if (!namePattern.test(name)) {
            alert("Student Name should contain only letters and spaces.");
            return false;
        }

        if (!idPattern.test(id)) {
            alert("Student ID should contain only numbers.");
            return false;
        }

        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return false;
        }

        if (!contactPattern.test(contact)) {
            alert("Contact Number should contain only numbers.");
            return false;
        }

        return true; // Return true if all validations pass
    }

    // Function to add a new student
    function addStudent(student) {
        const duplicateFields = findDuplicates(student.id, student.email, student.contact);
        if (duplicateFields.length > 0) {
            alert(`A student with the following field(s) already exists: ${duplicateFields.join(', ')}.`);
            return; // Prevent adding if there are duplicates
        }
        students.push(student); // Add the new student to the array
        localStorage.setItem('students', JSON.stringify(students)); // Save the updated array to local storage
        if (studentForm) {
            studentForm.reset(); // Reset the form
        }
        renderStudents(); // Re-render the student list
    }

    // Function to edit an existing student
    function editStudent(index, updatedStudent) {
        students[index] = updatedStudent; // Update the student data at the specified index
        localStorage.setItem('students', JSON.stringify(students)); // Save the updated array to local storage
        renderStudents(); // Re-render the student list
    }

    // Function to delete a student
    function deleteStudent(index) {
        students.splice(index, 1); // Remove the student at the specified index
        localStorage.setItem('students', JSON.stringify(students)); // Save the updated array to local storage
        renderStudents(); // Re-render the student list
    }

    // Event listener for form submission
    if (studentForm) {
        studentForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent the default form submission
            const name = studentForm.studentName.value.trim();
            const id = studentForm.studentId.value.trim();
            const email = studentForm.emailId.value.trim();
            const contact = studentForm.contactNo.value.trim();

            // Validate inputs and add student if valid
            if (validateInputs(name, id, email, contact)) {
                addStudent({ name, id, email, contact });
            }
        });
    }

    // Event listener for edit and delete actions in the student list
    if (studentList) {
        studentList.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit')) {
                const index = e.target.dataset.index; // Get the index of the student to edit
                const student = students[index];
                window.location.href = `../index.html?edit=${index}&name=${encodeURIComponent(student.name)}&id=${encodeURIComponent(student.id)}&email=${encodeURIComponent(student.email)}&contact=${encodeURIComponent(student.contact)}`;
            } else if (e.target.classList.contains('delete')) {
                const index = e.target.dataset.index; // Get the index of the student to delete
                deleteStudent(index);
            }
        });
    }

    // Function to populate the form with data for editing a student
    function populateFormForEdit() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('edit')) {
            const index = urlParams.get('edit');
            studentForm.studentName.value = urlParams.get('name');
            studentForm.studentId.value = urlParams.get('id');
            studentForm.emailId.value = urlParams.get('email');
            studentForm.contactNo.value = urlParams.get('contact');
            studentForm.querySelector('button[type="submit"]').textContent = 'Update';

            // Override form submission to update the student instead of adding a new one
            studentForm.onsubmit = (e) => {
                e.preventDefault();
                const updatedName = studentForm.studentName.value.trim();
                const updatedId = studentForm.studentId.value.trim();
                const updatedEmail = studentForm.emailId.value.trim();
                const updatedContact = studentForm.contactNo.value.trim();

                if (validateInputs(updatedName, updatedId, updatedEmail, updatedContact)) {
                    editStudent(index, {
                        name: updatedName,
                        id: updatedId,
                        email: updatedEmail,
                        contact: updatedContact
                    });
                    window.location.href = 'students.html'; // Redirect back to the students page after updating
                }
            };
        }
    }

    // Function to check if there are registered students and handle redirection
    function checkForStudents() {
        const currentPath = window.location.pathname;
        const isStudentsPage = currentPath.includes('students.html');
        if (isStudentsPage && students.length === 0) {
            alert('No students registered. Redirecting to registration page.');
            window.location.href = '../index.html';
        }
    }

    // Initialize the student list and populate the form if editing
    renderStudents();
    if (studentForm) populateFormForEdit();
    checkForStudents();
});
