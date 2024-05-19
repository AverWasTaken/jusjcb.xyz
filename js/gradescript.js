document.getElementById('percentage').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        convertToGrade();
    }
});

function convertToGrade() {
    const percentage = document.getElementById('percentage').value;
    let grade;
    let gradeClass;

    if (percentage >= 97) {
        grade = 'A+';
        gradeClass = 'grade-a';
    } else if (percentage >= 93) {
        grade = 'A';
        gradeClass = 'grade-a';
    } else if (percentage >= 90) {
        grade = 'A-';
        gradeClass = 'grade-a';
    } else if (percentage >= 87) {
        grade = 'B+';
        gradeClass = 'grade-b';
    } else if (percentage >= 83) {
        grade = 'B';
        gradeClass = 'grade-b';
    } else if (percentage >= 80) {
        grade = 'B-';
        gradeClass = 'grade-b';
    } else if (percentage >= 77) {
        grade = 'C+';
        gradeClass = 'grade-c';
    } else if (percentage >= 73) {
        grade = 'C';
        gradeClass = 'grade-c';
    } else if (percentage >= 70) {
        grade = 'C-';
        gradeClass = 'grade-c';
    } else if (percentage >= 67) {
        grade = 'D+';
        gradeClass = 'grade-d';
    } else if (percentage >= 63) {
        grade = 'D';
        gradeClass = 'grade-d';
    } else if (percentage >= 60) {
        grade = 'D-';
        gradeClass = 'grade-d';
    } else {
        grade = 'F';
        gradeClass = 'grade-f';
    }

    const resultElement = document.getElementById('result');
    const backgroundEffect = document.createElement('div');
    const blurWrapper = document.createElement('div');

    backgroundEffect.classList.add('background-effect', 'show');
    blurWrapper.classList.add('blur-wrapper');
    document.body.appendChild(backgroundEffect);
    document.querySelector('.container').appendChild(blurWrapper);

    resultElement.innerText = `${grade}`;
    resultElement.className = `${gradeClass} show`;

    setTimeout(() => {
        resultElement.classList.add('fade-out');
        backgroundEffect.classList.add('fade-out');
        blurWrapper.classList.add('unblur');

        setTimeout(() => {
            resultElement.className = '';
            resultElement.innerText = '';
            document.body.removeChild(backgroundEffect);
            document.querySelector('.container').removeChild(blurWrapper);
        }, 5000);
    }, 2000);
}
