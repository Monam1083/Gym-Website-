$(document).ready(function() {

    

    /**
     * Client-side form validation helper.
     * @param {jQuery} form - The jQuery object of the form element.
     * @param {string} phonePattern - Regex pattern for phone number validation.
     * @returns {boolean} - True if the form is valid, false otherwise.
     */
    function validateForm(form, phonePattern) {
        let isValid = true;
        const phoneRegex = new RegExp(phonePattern);
        
        //  Validate required fields and specific types
        form.find('[required]').each(function() {
            const $input = $(this);
            $input.removeClass('error-border');

            if ($input.val().trim() === '') {
                isValid = false;
                $input.addClass('error-border');
            } else if ($input.attr('type') === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test($input.val())) {
                isValid = false;
                $input.addClass('error-border').attr('title', 'Invalid email format');
            } else if ($input.attr('type') === 'tel' && $input.attr('pattern') && !phoneRegex.test($input.val().trim())) {
                isValid = false;
                $input.addClass('error-border').attr('title', 'Phone number must be 11 digits (e.g., 03xxxxxxxxx)');
            } else if ($input.attr('type') === 'checkbox' && !$input.is(':checked')) {
                isValid = false;
                
                $input.closest('.checkbox-group').addClass('error-border');
            }
        });

        
        form.find('.checkbox-group').not(':has(:checkbox:not(:checked))').removeClass('error-border');

        return isValid;
    }

    /**
     * Display form submission message.
     * @param {jQuery} messageElement - The jQuery object for the message P tag.
     * @param {string} text - The message text.
     * @param {boolean} isSuccess - True for success, false for error.
     */
    function displayMessage(messageElement, text, isSuccess) {
        messageElement.text(text).removeClass('success error').addClass(isSuccess ? 'success' : 'error').slideDown();
        setTimeout(() => messageElement.slideUp(), 5000);
    }

    // Header & Navigation ---

    // Mobile Menu Toggle (Hamburger)
    $('.hamburger').on('click', function() {
        $('.mobile-nav').slideToggle(300, function() {
            const isVisible = $(this).is(':visible');
            $('.hamburger i').toggleClass('fa-bars fa-times');
            $(this).attr('aria-hidden', !isVisible);
        });
    });

    // Close mobile menu on link click
    $('.mobile-nav a').on('click', function() {
        if ($('.mobile-nav').is(':visible')) {
            $('.mobile-nav').slideUp(300);
            $('.hamburger i').removeClass('fa-times').addClass('fa-bars');
            $('.mobile-nav').attr('aria-hidden', true);
        }
    });

    // . Registration Modal Logic (index.html) ---
    const $modal = $('#registrationModal');
    const $form = $('#registrationForm');
    const $message = $('#regMessage');
    const $closeBtn = $('#closeModalBtn');
    const $openBtn = $('#openModalBtn');

    
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        setTimeout(() => $modal.fadeIn(400).css('display', 'flex'), 1500);
    }

    
    $openBtn.on('click', () => $modal.fadeIn(300).css('display', 'flex'));

    
    $closeBtn.on('click', () => $modal.fadeOut(300));
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') $modal.fadeOut(300);
    });
    $modal.on('click', function(e) {
        if ($(e.target).is($modal)) $modal.fadeOut(300);
    });

    
    $form.on('submit', function(e) {
        e.preventDefault();
        $message.hide().removeClass('success error');

        if (validateForm($form, '^[0-9]{11}$')) {
            
            const formData = $(this).serializeArray();
            console.log('Registration Form Data:', formData);

            $form[0].reset(); // Clear form
            displayMessage($message, 'Registration successful! We will contact you shortly.', true);
            
            
            setTimeout(() => $modal.fadeOut(300), 3000);

        } else {
            displayMessage($message, 'Please fill in all required fields correctly.', false);
        }
    });

    
    (function populateUtm() {
        const urlParams = new URLSearchParams(window.location.search);
        $('#utm_source').val(urlParams.get('utm_source') || 'direct');
        $('#utm_medium').val(urlParams.get('utm_medium') || 'none');
        $('#con_utm_source').val(urlParams.get('utm_source') || 'direct');
        $('#con_utm_medium').val(urlParams.get('utm_medium') || 'none');
    })();

    //  Contact Form Logic (contact.html) ---
    const $contactForm = $('#contactForm');
    const $contactMessage = $('#contactMessage');

    
    if (window.location.pathname.endsWith('contact.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const trainer = urlParams.get('trainer');
        const plan = urlParams.get('plan');
        
        if (trainer) {
            $('#conMessage').val(`I would like to book a consultation session with Trainer ${trainer.charAt(0).toUpperCase() + trainer.slice(1)}.`);
        }
        if (plan) {
            $('#conPlan').val(plan);
        }
    }

    $contactForm.on('submit', function(e) {
        e.preventDefault();
        $contactMessage.hide().removeClass('success error');

        if (validateForm($contactForm, '^[0-9]{11}$')) {
            // Simulate successful AJAX submission
            const formData = $(this).serializeArray();
            console.log('Contact Form Data:', formData);

            $contactForm[0].reset();
            displayMessage($contactMessage, 'Thank you! Your message has been sent. We will contact you soon.', true);
        } else {
            displayMessage($contactMessage, 'Please ensure all required fields are correctly filled.', false);
        }
    });

    //  Animated Numeric Counters (index.html) ---
    const $counters = $('.counter');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        $counters.each(function() {
            const $this = $(this);
            const target = parseInt($this.attr('data-target'));
            const duration = 2000;
            const step = Math.ceil(target / (duration / 10));

            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                    countersAnimated = true;
                }
                $this.text(current.toLocaleString());
            }, 10);
        });
    }

    // Intersection Observer to trigger animation on scroll
    if ($counters.length > 0 && typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% of the section is visible

        $('.counters-section').each((index, element) => {
            observer.observe(element);
        });
    }

    // --- 6. Equipment Image Carousel (index.html) ---
    const $carouselTrack = $('.carousel-track');
    const $slides = $('.carousel-slide');
    const slideCount = $slides.length;
    let currentIndex = 0;

    function goToSlide(index) {
        if (index < 0) {
            // Loop from end (seamless transition required for real loop)
            // For simple implementation, snap to the end/start
            currentIndex = slideCount - 1;
        } else if (index >= slideCount) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        const offset = -currentIndex * 100 / slideCount; // Each slide is 100/slideCount % of total width
        $carouselTrack.css('transform', `translateX(${offset}%)`);
    }

    $('.carousel-nav.next').on('click', () => goToSlide(currentIndex + 1));
    $('.carousel-nav.prev').on('click', () => goToSlide(currentIndex - 1));

    // Auto-rotate logic
    let autoRotate = setInterval(() => goToSlide(currentIndex + 1), 5000);

    // Pause on hover
    $('.carousel-container').hover(
        () => clearInterval(autoRotate),
        () => autoRotate = setInterval(() => goToSlide(currentIndex + 1), 5000)
    );
    
    // Basic swipe functionality for mobile (using jQuery's basic swipe events)
    let touchstartX = 0;
    let touchendX = 0;

    $carouselTrack.on('touchstart', function(event) {
        touchstartX = event.originalEvent.touches[0].clientX;
    });

    $carouselTrack.on('touchend', function(event) {
        touchendX = event.originalEvent.changedTouches[0].clientX;
        handleGesture();
    });

    function handleGesture() {
        const threshold = 50; // Minimum distance for a swipe

        if (touchendX < touchstartX - threshold) {
            // Swiped left
            goToSlide(currentIndex + 1);
        }

        if (touchendX > touchstartX + threshold) {
            // Swiped right
            goToSlide(currentIndex - 1);
        }
    }

    //  7. Trainer Filter Logic (trainers.html) ---
    $('#specializationFilter').on('change', function() {
        const filterValue = $(this).val();
        $('.trainer-card').each(function() {
            const $card = $(this);
            const specializations = $card.data('specialization');

            if (filterValue === 'all' || specializations.includes(filterValue)) {
                $card.slideDown(300).attr('aria-hidden', 'false');
            } else {
                $card.slideUp(300).attr('aria-hidden', 'true');
            }
        });
    });
    
    //  Blog Modal Logic (blog.html) ---
    const blogPosts = {
        'hypertrophy': {
            title: 'The Science of Hypertrophy: Maximizing Muscle Growth',
            meta: '<span class="author"><i class="fas fa-user"></i> By Ahmed Khan, CSCS</span> | <span class="date"><i class="fas fa-calendar-alt"></i> December 1, 2025</span>',
            content: `
                <img src="placeholder_blog1.jpg" alt="Scientific diagram of muscle fibers" style="width:100%; height:auto; border-radius: 5px; margin-bottom: 20px;">
                <p>To maximize muscle hypertrophy, we must understand the three core mechanisms:</p>
                
                <h4>1. Mechanical Tension</h4>
                <p>This is the force generated by the muscle fibers. Heavy lifting (80%+ of 1RM) or moderate lifting to failure are the most effective ways to maximize tension. The stimulus must be consistently challenging to the muscle.</p>

                <h4>2. Metabolic Stress</h4>
                <p>The accumulation of metabolites (e.g., lactate) during exercise, often associated with the 'pump'. This is maximized by moderate weight (60-80% 1RM) and high-rep sets (12-20 reps) with short rest periods. This stress stimulates hormonal and cellular pathways conducive to growth.</p>
                
                <h4>3. Muscle Damage</h4>
                <p>Microscopic tears in the muscle fibers, which lead to an inflammatory response and subsequent repair, resulting in adaptation (growth). Beginners should be wary of excessive damage, but for experienced lifters, novel exercises or a new tempo can help induce this.</p>
                
                <p><strong>References:</strong></p>
                <ul>
                    <li>Schoenfeld, B. J. (2010). The mechanisms of muscle hypertrophy and their application to resistance training. J Strength Cond Res.</li>
                    <li>Phillips, S. M. (2014). A brief review of critical processes in exercise-induced muscular hypertrophy. Sports Med.</li>
                </ul>
                <p class="text-center"><em>Consult a trainer before starting any new program!</em></p>
            `
        },
        'protein': {
            title: 'Optimal Protein Intake for Post-Workout Recovery',
            meta: '<span class="author"><i class="fas fa-user"></i> By Sana Tariq, PN-L1</span> | <span class="date"><i class="fas fa-calendar-alt"></i> November 15, 2025</span>',
            content: `
                <img src="placeholder_blog2.jpg" alt="Overhead shot of a balanced healthy meal" style="width:100%; height:auto; border-radius: 5px; margin-bottom: 20px;">
                <p>The concept of a narrow 'anabolic window' immediately after a workout is largely outdated. Current research suggests that as long as you consume adequate protein across the entire day, the timing is less critical than once believed. However, strategic protein intake remains beneficial.</p>
                
                <h4>How Much Protein?</h4>
                <p>For most resistance-training individuals, a total daily intake of <strong>1.6 to 2.2 grams of protein per kilogram of body weight</strong> is optimal for muscle gain and retention.</p>
                
                <h4>Optimal Timing</h4>
                <p>Aim to consume <strong>0.4 to 0.55 g/kg of protein</strong> in each of four main meals spread 3–5 hours apart. Consuming a protein-rich meal (20–40g of high-quality protein) within 1–2 hours pre- and post-workout can still be highly effective.</p>
                
                <h4>Best Sources</h4>
                <p>Focus on complete protein sources: Eggs, Lean Meats, Dairy (Whey/Casein), Fish, and high-quality plant proteins like Soy and Quinoa.</p>
                
                <p><strong>References:</strong></p>
                <ul>
                    <li>Jäger, R., et al. (2017). International Society of Sports Nutrition position stand: protein and exercise. J Int Soc Sports Nutr.</li>
                    <li>Schoenfeld, B. J., et al. (2017). The effect of protein timing on muscle strength and hypertrophy. Nutrients.</li>
                </ul>
            `
        },
        'hiit-liss': {
            title: 'HIIT vs. LISS: Which Cardio is Right for Your Goal?',
            meta: '<span class="author"><i class="fas fa-user"></i> By Fatima Rizvi, CF-L1</span> | <span class="date"><i class="fas fa-calendar-alt"></i> October 28, 2025</span>',
            content: `
                <img src="placeholder_blog3.jpg" alt="Heart rate monitor screen displaying high intensity interval training" style="width:100%; height:auto; border-radius: 5px; margin-bottom: 20px;">
                <p>Choosing between High-Intensity Interval Training (HIIT) and Low-Intensity Steady State (LISS) cardio depends entirely on your goal and lifestyle:</p>
                
                <h4>HIIT (High-Intensity Interval Training)</h4>
                <p>HIIT involves short bursts of near-maximal effort followed by brief rest periods (e.g., 30s sprint, 60s walk, repeated). It's time-efficient and promotes the 'afterburn effect' (EPOC), meaning you continue to burn calories post-exercise. **Best for:** Busy schedules, improving anaerobic capacity, and aggressive fat loss.</p>

                <h4>LISS (Low-Intensity Steady State)</h4>
                <p>LISS involves continuous, moderate-paced activity (e.g., 45 minutes on a treadmill) where you can hold a conversation. It primarily utilizes fat as fuel *during* the session. **Best for:** Endurance training, recovery, and minimizing joint stress.</p>
                
                <p><strong>Conclusion:</strong> Both are effective for fat loss. HIIT is time-efficient but taxing; LISS is gentler but time-consuming. We recommend integrating both into your weekly routine for optimal cardiovascular health and body composition.</p>
                
                <p><strong>References:</strong></p>
                <ul>
                    <li>Gillette, N. M. (2009). The role of exercise in the treatment of obesity. Med Sci Sports Exerc.</li>
                    <li>Laursen, P. B., & Jenkins, D. G. (2002). The scientific basis for high-intensity interval training. Sports Med.</li>
                </ul>
            `
        }
    };

    const $postModal = $('#fullPostModal');
    const $closePostModalBtn = $('#closePostModalBtn');

    $('.read-more-btn').on('click', function() {
        const postId = $(this).data('post-id');
        const post = blogPosts[postId];
        
        if (post) {
            $('#postModalTitle').text(post.title);
            $('.post-meta-modal').html(post.meta);
            $('.post-body-modal').html(post.content);
            $postModal.fadeIn(300).css('display', 'flex');
        }
    });

    $closePostModalBtn.on('click', () => $postModal.fadeOut(300));
    $postModal.on('click', function(e) {
        if ($(e.target).is($postModal)) $postModal.fadeOut(300);
    });

    //  BMI & TDEE Calculators (calculator.html) ---

    // BMI Calculator Logic
    const $bmiForm = $('#bmiForm');
    const $bmiResult = $('#bmiResult');
    const $metricFields = $bmiForm.find('.metric-fields');
    const $imperialFields = $bmiForm.find('.imperial-fields');
    
    
    $('input[name="bmi-units"]').on('change', function() {
        if ($(this).val() === 'imperial') {
            $metricFields.addClass('hidden').find('input').removeAttr('required');
            $imperialFields.removeClass('hidden').find('input').attr('required', 'required');
        } else {
            $imperialFields.addClass('hidden').find('input').removeAttr('required');
            $metricFields.removeClass('hidden').find('input').attr('required', 'required');
        }
    }).trigger('change'); // Initialize visibility

    $bmiForm.on('submit', function(e) {
        e.preventDefault();
        $bmiResult.html(''); // Clear previous results

        const isMetric = $('input[name="bmi-units"]:checked').val() === 'metric';
        let weight, height_m, resultHtml;

        try {
            if (isMetric) {
                const weight_kg = parseFloat($('#weight_kg').val());
                const height_cm = parseFloat($('#height_cm').val());
                if (isNaN(weight_kg) || isNaN(height_cm) || height_cm <= 0 || weight_kg <= 0) throw new Error("Invalid metric input.");
                
                weight = weight_kg;
                height_m = height_cm / 100;
            } else {
                const weight_lb = parseFloat($('#weight_lb').val());
                const height_ft = parseFloat($('#height_ft').val());
                const height_in = parseFloat($('#height_in').val()) || 0;
                if (isNaN(weight_lb) || isNaN(height_ft) || weight_lb <= 0) throw new Error("Invalid imperial input.");

                weight = weight_lb * 0.453592; // Convert lb to kg
                height_m = (height_ft * 12 + height_in) * 0.0254; // Convert ft/in to meters
            }

            const bmi = weight / (height_m * height_m);
            const bmiValue = bmi.toFixed(2);
            let category, recommendation;

            if (bmi < 18.5) {
                category = 'Underweight';
                recommendation = 'Focus on healthy weight gain. We suggest consulting our nutrition plan and a personal trainer to build lean mass safely.';
            } else if (bmi >= 18.5 && bmi < 25) {
                category = 'Normal Weight';
                recommendation = 'Your BMI is within the healthy range. Maintain your lifestyle, focusing on strength and conditioning.';
            } else if (bmi >= 25 && bmi < 30) {
                category = 'Overweight';
                recommendation = 'Consider a moderate weight loss strategy. Our calorie calculator and nutrition plan can help, or consult a trainer.';
            } else {
                category = 'Obese';
                recommendation = 'It is highly recommended to seek professional guidance from a personal trainer and nutritionist for a structured weight management program.';
            }

            resultHtml = `
                <h3>Your BMI Result</h3>
                <p><strong>BMI Value:</strong> ${bmiValue}</p>
                <p><strong>Category:</strong> <span style="font-weight:700; color: ${category.includes('Normal') ? 'var(--primary-color)' : 'var(--accent-color)'};">${category}</span></p>
                <p><strong>Recommendation:</strong> ${recommendation}</p>
            `;

        } catch (error) {
            resultHtml = `<p class="error">Please enter valid, non-zero weight and height values in the selected unit system.</p>`;
        }
        
        $bmiResult.html(resultHtml).slideDown();
    });

    
    const $tdeeForm = $('#tdeeForm');
    const $tdeeResult = $('#tdeeResult');

    
    $('#tdee_weight_kg').attr('placeholder', 'Weight in kg');
    $('#tdee_height_cm').attr('placeholder', 'Height in cm');
    
    $tdeeForm.on('submit', function(e) {
        e.preventDefault();
        $tdeeResult.html('');
        $('#generateDietPlanBtn').addClass('hidden');

        try {
            const age = parseInt($('#tdee_age').val());
            const gender = $('#tdee_gender').val();
            const weight_kg = parseFloat($('#tdee_weight_kg').val());
            const height_cm = parseFloat($('#tdee_height_cm').val());
            const activityFactor = parseFloat($('#tdee_activity').val());

            if (isNaN(age) || isNaN(weight_kg) || isNaN(height_cm) || !gender || isNaN(activityFactor)) {
                throw new Error("Missing input.");
            }

            
            let bmr;
            if (gender === 'male') {
                bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5;
            } else { 
                bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161;
            }

            const tdee = bmr * activityFactor;
            const maintain = Math.round(tdee);
            const loss = Math.round(tdee - 500); // 500 kcal deficit/day for ~0.45 kg/week loss
            const gain = Math.round(tdee + 400); // Average of 300-500 kcal surplus/day

            const resultHtml = `
                <h3>Your Calorie Estimates</h3>
                <p><strong>Estimated BMR (Basal Metabolic Rate):</strong> ${Math.round(bmr)} calories/day</p>
                <p><strong>Estimated TDEE (Total Daily Energy Expenditure):</strong> ${maintain} calories/day</p>
                
                <hr style="margin: 10px 0;">
                
                <h4>Recommended Daily Intake:</h4>
                <ul>
                    <li><strong>To Maintain Weight:</strong> ${maintain} calories</li>
                    <li><strong>To Lose Weight (~0.45kg/week):</strong> <span style="color: red;">${loss} calories</span></li>
                    <li><strong>To Gain Weight (~0.45kg/week):</strong> <span style="color: var(--primary-color);">${gain} calories</span></li>
                </ul>
            `;
            
            $tdeeResult.html(resultHtml).slideDown();
            $('#generateDietPlanBtn').removeClass('hidden');

        } catch (error) {
            $tdeeResult.html('<p class="error">Please ensure all TDEE fields are selected and correctly filled.</p>').slideDown();
        }
    });

    
    $('#generateDietPlanBtn').on('click', function() {
        const $dietPlanSection = $('#diet-plan');
        if ($dietPlanSection.length) {
            $('html, body').animate({
                scrollTop: $dietPlanSection.offset().top - 100 // Scroll to diet section, accounting for fixed header
            }, 800);
        }
    });

    // Diet Plan Tab Logic
    $('.tab-button').on('click', function() {
        const plan = $(this).data('plan');
        $('.tab-button').removeClass('active');
        $(this).addClass('active');
        $('.plan-tab').removeClass('active');
        $(`#plan-${plan}`).addClass('active');
    });

    
    $('.tab-button[data-plan="loss"]').trigger('click');


    
    $('.mobile-nav').hide();

    

});
