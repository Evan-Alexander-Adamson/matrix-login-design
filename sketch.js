let time = 0;
let particles = [];
const numParticles = 150;
const PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio
const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(RGB); // Switch to RGB color mode
    background(0); // Pure black background
    
    // Initialize particles along sacred geometric patterns
    initializeParticles();
}

function initializeParticles() {
    particles = [];
    // Create particles along fibonacci spiral and other sacred patterns
    for (let i = 0; i < numParticles; i++) {
        // Fibonacci spiral position
        let theta = i * PHI * TWO_PI;
        let r = sqrt(i) * 20;
        let x = width/2 + cos(theta) * r;
        let y = height/2 + sin(theta) * r;
        
        // Add some particles in vesica piscis pattern
        if (i < numParticles/3) {
            let angle = (i / (numParticles/3)) * TWO_PI;
            x = width/2 + cos(angle) * 100;
            y = height/2 + sin(angle) * 100;
        }
        
        particles.push({
            pos: createVector(x, y),
            vel: createVector(0, 0),
            phase: i * PHI,
            radius: r,
            brightness: random(40, 255) // Adjusted for RGB mode
        });
    }
}

function evaluatePolynomial(x, t1, t2) {
    // Enhanced polynomial evaluation incorporating sacred ratios
    let result = {
        real: Math.pow(x.real * PHI, 24),
        imag: 0
    };
    
    // Main terms using fibonacci sequence for coefficients
    FIBONACCI.forEach((fib, i) => {
        let term = complexMult(
            { real: fib * Math.pow(x.real, 16 - i), imag: fib * PHI },
            { real: Math.pow(x.real, 19), imag: x.imag * PHI }
        );
        result = complexAdd(result, term);
    });
    
    return result;
}

function complexAdd(a, b) {
    return {
        real: a.real + b.real,
        imag: a.imag + b.imag
    };
}

function complexMult(a, b) {
    return {
        real: a.real * b.real - a.imag * b.imag,
        imag: a.real * b.imag + a.imag * b.real
    };
}

function draw() {
    // Dark, semi-transparent background for trail effect
    fill(0, 20); // Reduced alpha for longer trails
    noStroke();
    rect(0, 0, width, height);
    
    // Update time parameters using golden ratio
    time += 0.01;
    let t1 = {
        real: cos(time * PHI),
        imag: sin(time * PHI)
    };
    let t2 = {
        real: cos(-time * PHI * PHI),
        imag: sin(-time * PHI * PHI)
    };
    
    // Draw subtle sacred geometry guidelines in dark green
    drawSacredGeometry();
    
    // Update and draw particles
    particles.forEach((particle, i) => {
        let x = {
            real: map(particle.pos.x, 0, width, -PHI, PHI),
            imag: map(particle.pos.y, 0, height, -PHI, PHI)
        };
        
        let field = evaluatePolynomial(x, t1, t2);
        
        let spiralAngle = atan2(particle.pos.y - height/2, particle.pos.x - width/2);
        let spiralInfluence = (spiralAngle + time) * PHI;
        
        let angle = atan2(field.imag, field.real) + spiralInfluence;
        let magnitude = sqrt(field.real * field.real + field.imag * field.imag);
        magnitude = constrain(magnitude, 0, 5);
        
        // Update particle velocity and position
        particle.vel.x = cos(angle) * magnitude * 0.3;
        particle.vel.y = sin(angle) * magnitude * 0.3;
        particle.pos.add(particle.vel);
        
        // Keep particles within bounds
        particle.pos.x = ((particle.pos.x - width/2 + width) % width + width) % width;
        particle.pos.y = ((particle.pos.y - height/2 + height) % height + height) % height;
        
        // Matrix-style green color variations
        let brightness = map(magnitude, 0, 5, 20, 255);
        particle.brightness = lerp(particle.brightness, brightness, 0.1);
        
        // Draw particle trails with Matrix green glow
        let green = color(0, particle.brightness, 0, 150); // Pure green with alpha
        stroke(green);
        strokeWeight(1.5);
        
        let prevX = particle.pos.x - particle.vel.x * PHI * 3;
        let prevY = particle.pos.y - particle.vel.y * PHI * 3;
        
        // Add glow effect
        drawingContext.shadowBlur = 10;
        drawingContext.shadowColor = `rgb(0, ${particle.brightness}, 0)`;
        line(prevX, prevY, particle.pos.x, particle.pos.y);
        drawingContext.shadowBlur = 0;
    });
}

function drawSacredGeometry() {
    // Draw subtle sacred geometry guidelines in dark matrix green
    let darkGreen = color(0, 50, 0, 30); // More visible dark green
    stroke(darkGreen);
    strokeWeight(1);
    noFill();
    
    // Flower of life pattern
    for (let i = 0; i < 6; i++) {
        let angle = i * TWO_PI / 6;
        let x = width/2 + cos(angle) * 100;
        let y = height/2 + sin(angle) * 100;
        circle(x, y, 200);
    }
    
    // Golden spiral
    beginShape();
    for (let i = 0; i < 200; i++) {
        let theta = i * 0.1;
        let r = pow(PHI, theta) * 2;
        let x = width/2 + cos(theta) * r;
        let y = height/2 + sin(theta) * r;
        vertex(x, y);
    }
    endShape();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(0);
    initializeParticles();
}
