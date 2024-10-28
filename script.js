// Future JavaScript functionality can be added here

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    const formRect = loginForm.getBoundingClientRect();
    let lastPosition = { x: -4, y: -4 };
    let currentLine = null;
    let isHovering = false;
    
    // Add hover event listeners
    loginForm.addEventListener('mouseenter', () => {
        isHovering = true;
        loginForm.classList.add('hover-glow');
    });
    
    loginForm.addEventListener('mouseleave', () => {
        isHovering = false;
        loginForm.classList.remove('hover-glow');
    });
    
    function createTrailLine(startX, startY, endX, endY) {
        if (isHovering) return; // Don't create trails while hovering
        
        const line = document.createElement('div');
        line.className = 'trail-line';
        
        // Calculate line length and angle
        const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
        
        // Position and rotate line
        line.style.width = `${length}px`;
        line.style.height = '2px';
        line.style.position = 'absolute';
        line.style.left = `${startX}px`;
        line.style.top = `${startY}px`;
        line.style.transformOrigin = '0 0';
        line.style.transform = `rotate(${angle}deg)`;
        
        // Animate fade out
        line.style.animation = 'fadeTrail 1s linear forwards';
        
        loginForm.appendChild(line);
        
        // Remove line after animation
        setTimeout(() => {
            line.remove();
        }, 1000);
    }
    
    // Update trail every frame
    function updateTrail() {
        if (!isHovering) {
            const dot = document.querySelector('.login-form::before');
            if (!dot) return;
            
            const computedStyle = window.getComputedStyle(dot);
            const matrix = new DOMMatrix(computedStyle.transform);
            const currentX = parseFloat(computedStyle.left) + matrix.m41;
            const currentY = parseFloat(computedStyle.top) + matrix.m42;
            
            if (Math.abs(currentX - lastPosition.x) > 1 || Math.abs(currentY - lastPosition.y) > 1) {
                createTrailLine(lastPosition.x, lastPosition.y, currentX, currentY);
                lastPosition = { x: currentX, y: currentY };
            }
        }
        
        requestAnimationFrame(updateTrail);
    }
    
    updateTrail();
});
