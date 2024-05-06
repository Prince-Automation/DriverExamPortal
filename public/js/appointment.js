'use strict';

$(document).ready(function() {
    // Array to store selected time slots
    let selectedTimeSlots = [];

    $('#timeSlotsContainer').on('click', '.time-slot', function(event) {
        event.preventDefault(); // Prevent form submission

        var button = $(this);
        var timeSlot = button.attr('id');

        // Toggle selection state
        if (button.hasClass('selected')) {
            // Remove from selectedTimeSlots
            selectedTimeSlots = selectedTimeSlots.filter(slot => slot !== timeSlot);
            button.removeClass('selected');
        } else {
            // Add to selectedTimeSlots
            selectedTimeSlots.push(timeSlot);
            button.addClass('selected');
        }

        // Sort the selectedTimeSlots array
        selectedTimeSlots.sort();

        // Update hidden input value
        $('#time').val(selectedTimeSlots.join(','));
    });

    $('#date').on('change', function() {
        // Clear selected time slots and update buttons
        selectedTimeSlots = [];
        $('.time-slot').removeClass('selected');
        $('#time').val('');
    });
});