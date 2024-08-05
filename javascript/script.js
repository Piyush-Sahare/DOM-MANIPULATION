document.addEventListener('DOMContentLoaded', () => {
    // Select elements from the DOM
    const studentForm = document.getElementById('studentForm');
    const studentList = document.getElementById('studentList');
    // Retrieve the list of students from local storage or initialize an empty array
    let students = JSON.parse(localStorage.getItem('students')) || [];

    // Function to render the student list on the page
    function renderStudents() {
        if (studentList) {
            studentList.innerHTML = ''; // Clear existing list
            if (students.length > 0) {
                const table = document.createElement('table'); // Create a new table
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
                const tbody = document.createElement('tbody');
                // Iterate over students and create a row for each student
                students.forEach((student, index) => {
                    const row = document.createElement('tr');
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
                    tbody.appendChild(row);
                });
                table.appendChild(tbody);
                studentList.appendChild(table); // Append the table to the studentList div
            } else {
                studentList.innerHTML = '<p>No students registered.</p>';
            }
        }
    }

    // Function to check for duplicate students by student ID, email ID, or contact number
    function findDuplicates(studentId, emailId, contact) {
        let duplicateFields = [];

        students.forEach(student => {
            if (student.id === studentId) duplicateFields.push('Student ID');
            if (student.email === emailId) duplicateFields.push('Email ID');
            if (student.contact === contact) duplicateFields.push('Contact No');
        });

        return duplicateFields; // Return an array of fields that have duplicates
    }

    // Function to add a new student
    function addStudent(student) {
        const duplicateFields = findDuplicates(student.id, student.email, student.contact);
        if (duplicateFields.length > 0) {
            alert(`A student with the following field(s) already exists: ${duplicateFields.join(', ')}.`);
            return; // Prevent adding a duplicate student
        }
        students.push(student); // Add new student to the list
        localStorage.setItem('students', JSON.stringify(students)); // Save updated list to local storage
        if (studentForm) {
            studentForm.reset(); // Reset the form
        }
        renderStudents(); // Re-render the student list
    }

    // Function to edit an existing student
    function editStudent(index, updatedStudent) {
        students[index] = updatedStudent; // Update student details at the specified index
        localStorage.setItem('students', JSON.stringify(students)); // Save updated list to local storage
        renderStudents(); // Re-render the student list
    }

    // Function to delete a student
    function deleteStudent(index) {
        students.splice(index, 1); // Remove the student at the specified index
        localStorage.setItem('students', JSON.stringify(students)); // Save updated list to local storage
        renderStudents(); // Re-render the student list
    }

    // Event listener for the student form submission
    if (studentForm) {
        studentForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission behavior
            const name = studentForm.studentName.value.trim();
            const id = studentForm.studentId.value.trim();
            const email = studentForm.emailId.value.trim();
            const contact = studentForm.contactNo.value.trim();

            if (name && id && email && contact) {
                addStudent({ name, id, email, contact }); // Add the student if all fields are filled
            }
        });
    }

    // Event listener for the student list actions (edit and delete)
    if (studentList) {
        studentList.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit')) {
                const index = e.target.dataset.index; // Get the index of the student to edit
                const student = students[index];
                // Redirect to the registration page with student details in the query parameters
                window.location.href = `../index.html?edit=${index}&name=${encodeURIComponent(student.name)}&id=${encodeURIComponent(student.id)}&email=${encodeURIComponent(student.email)}&contact=${encodeURIComponent(student.contact)}`;
            } else if (e.target.classList.contains('delete')) {
                const index = e.target.dataset.index; // Get the index of the student to delete
                deleteStudent(index); // Delete the student
            }
        });
    }

    // Function to populate the form for editing a student
    function populateFormForEdit() {
        const urlParams = new URLSearchParams(window.location.search); // Get URL query parameters
        if (urlParams.has('edit')) {
            const index = urlParams.get('edit');
            studentForm.studentName.value = urlParams.get('name');
            studentForm.studentId.value = urlParams.get('id');
            studentForm.emailId.value = urlParams.get('email');
            studentForm.contactNo.value = urlParams.get('contact');
            studentForm.querySelector('button[type="submit"]').textContent = 'Update';

            studentForm.onsubmit = (e) => {
                e.preventDefault(); // Prevent default form submission
                editStudent(index, {
                    name: studentForm.studentName.value.trim(),
                    id: studentForm.studentId.value.trim(),
                    email: studentForm.emailId.value.trim(),
                    contact: studentForm.contactNo.value.trim()
                });
                window.location.href = 'students.html'; // Redirect to the list of students
            };
        }
    }

    // Function to check if there are any students before rendering students.html
    function checkForStudents() {
        if (window.location.pathname.includes('students.html') && students.length === 0) {
            alert('No students registered. Redirecting to registration page.');
            window.location.href = '../index.html'; // Redirect if no students are registered
        }
    }

    // Initial rendering and checks
    renderStudents(); // Initial render of the student list
    if (studentForm) populateFormForEdit(); // Populate the form for editing if applicable
    checkForStudents(); // Check for students before displaying the list
});
