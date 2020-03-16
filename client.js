
document.addEventListener('DOMContentLoaded',()=>{
    var stripe = Stripe('pk_test_jTcvZUaY0zm2YBTKixbaWZI700OFTYDBaK');

    var elements = stripe.elements();
    var cardElement = elements.create('card');
    var cardholderName = document.getElementById('cardholder-name');
    var cardButton = document.getElementById('card-button');
    var clientSecret = cardButton.dataset.secret;

    cardButton.addEventListener('click', function(ev) {

        stripe.confirmCardSetup(
            clientSecret,
            {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: cardholderName.value,
                    },
                },
            }
        ).then(function(result) {
            if (result.error) {
                // Display error.message in your UI.
            } else {
                // The setup has succeeded. Display a success message.
            }
        });
    });
    cardElement.mount('#card-element');
})