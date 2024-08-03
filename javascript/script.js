document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('studentForm');
    const studentList = document.getElementById('studentList');
    let students = JSON.parse(localStorage.getItem('students')) || [];

    // Function to render the student list
    function renderStudents() {
        if (studentList) {
            studentList.innerHTML = '';
            if (students.length > 0) {
                const table = document.createElement('table');
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
                studentList.appendChild(table);
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

        return duplicateFields;
    }

    // Function to add a new student
    function addStudent(student) {
        const duplicateFields = findDuplicates(student.id, student.email, student.contact);
        if (duplicateFields.length > 0) {
            alert(`A student with the following field(s) already exists: ${duplicateFields.join(', ')}.`);
            return;
        }
        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));
        if (studentForm) {
            studentForm.reset();
        }
        renderStudents();
    }

    // Function to edit an existing student
    function editStudent(index, updatedStudent) {
        students[index] = updatedStudent;
        localStorage.setItem('students', JSON.stringify(students));
        renderStudents();
    }

    // Function to delete a student
    function deleteStudent(index) {
        students.splice(index, 1);
        localStorage.setItem('students', JSON.stringify(students));
        renderStudents();
    }

    // Event listener for the student form submission
    if (studentForm) {
        studentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = studentForm.studentName.value.trim();
            const id = studentForm.studentId.value.trim();
            const email = studentForm.emailId.value.trim();
            const contact = studentForm.contactNo.value.trim();

            if (name && id && email && contact) {
                addStudent({ name, id, email, contact });
            }
        });
    }

    // Event listener for the student list actions
    if (studentList) {
        studentList.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit')) {
                const index = e.target.dataset.index;
                const student = students[index];
                window.location.href = `index.html?edit=${index}&name=${encodeURIComponent(student.name)}&id=${encodeURIComponent(student.id)}&email=${encodeURIComponent(student.email)}&contact=${encodeURIComponent(student.contact)}`;
            } else if (e.target.classList.contains('delete')) {
                const index = e.target.dataset.index;
                deleteStudent(index);
            }
        });
    }

    // Function to populate the form for editing a student
    function populateFormForEdit() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('edit')) {
            const index = urlParams.get('edit');
            studentForm.studentName.value = urlParams.get('name');
            studentForm.studentId.value = urlParams.get('id');
            studentForm.emailId.value = urlParams.get('email');
            studentForm.contactNo.value = urlParams.get('contact');
            studentForm.querySelector('button[type="submit"]').textContent = 'Update';

            studentForm.onsubmit = (e) => {
                e.preventDefault();
                editStudent(index, {
                    name: studentForm.studentName.value.trim(),
                    id: studentForm.studentId.value.trim(),
                    email: studentForm.emailId.value.trim(),
                    contact: studentForm.contactNo.value.trim()
                });
                window.location.href = 'students.html';
            };
        }
    }

    // Function to check if there are any students before rendering students.html
    function checkForStudents() {
        if (window.location.pathname.includes('students.html') && students.length === 0) {
            alert('No students registered. Redirecting to registration page.');
            window.location.href = 'index.html';
        }
    }

    // Initial rendering and checks
    renderStudents();
    if (studentForm) populateFormForEdit();
    checkForStudents();
});
