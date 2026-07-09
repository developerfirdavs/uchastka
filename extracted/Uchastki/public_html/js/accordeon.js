document.querySelectorAll('.question').forEach(question => {
    question.addEventListener('click', () => {
        const parent = question.parentElement;
        if(parent.classList.contains('active')) {
            parent.classList.remove('active');
        } else {
            document.querySelectorAll('.accordion-item.active').forEach(item => item.classList.remove('active'));
            parent.classList.add('active');
        }
    });
});