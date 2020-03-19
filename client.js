let publicKey = 'pk_test_jTcvZUaY0zm2YBTKixbaWZI700OFTYDBaK';


var stripeElements = function (setupIntent) {
    var stripe = Stripe(publicKey);
    var elements = stripe.elements();

    // Element styles
    var style = {
        base: {
            fontSize: "16px",
            color: "#32325d",
            fontFamily:
                "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
            fontSmoothing: "antialiased",
            "::placeholder": {
                color: "rgba(0,0,0,0.4)"
            }
        }
    };

    var card = elements.create("card", {style: style});

    card.mount("#card-element");

    // Element focus ring
    card.on("focus", function () {
        var el = document.getElementById("card-element");
        el.classList.add("focused");
    });

    card.on("blur", function () {
        var el = document.getElementById("card-element");
        el.classList.remove("focused");
    });

    // Handle payment submission when user clicks the pay button.
    var button = document.getElementById("submit");
    button.addEventListener("click", function (event) {
        event.preventDefault();
        console.log(clientSecret);
        stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
            }
        }).then(function (result) {
            if (result.error) {
                // Show error to your customer (e.g., insufficient funds)
                console.log(result.error.message);
            } else {
                // The payment has been processed!
                if (result.paymentIntent.status === 'succeeded') {

                    StripeChannel.postMessage('Hello World being called from Javascript code');
                    // Show a success message to your customer
                    // There's a risk of the customer closing the window before callback
                    // execution. Set up a webhook or plugin to listen for the
                    // payment_intent.succeeded event that handles any business critical
                    // post-payment actions.
                }
            }
        });
    });
};
var getSetupIntent = function () {
    return fetch("/create-setup-intent", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (setupIntent) {
            stripeElements(publicKey, setupIntent);
        });
};

var getPublicKey = function () {
    return fetch("/public-key", {
        method: "get",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            getSetupIntent(response.publicKey);
        });
};

// Show a spinner on payment submission
var changeLoadingState = function (isLoading) {
    if (isLoading) {
        document.querySelector("button").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        document.querySelector("button").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
};

/* Shows a success / error message when the payment is complete */
var orderComplete = function (stripe, clientSecret) {
    stripe.retrieveSetupIntent(clientSecret).then(function (result) {
        var setupIntent = result.setupIntent;
        var setupIntentJson = JSON.stringify(setupIntent, null, 2);

        document.querySelector(".sr-payment-form").classList.add("hidden");
        document.querySelector(".sr-result").classList.remove("hidden");
        document.querySelector("pre").textContent = setupIntentJson;
        setTimeout(function () {
            document.querySelector(".sr-result").classList.add("expand");
        }, 200);

        changeLoadingState(false);
    });
};

document.addEventListener('DOMContentLoaded', () => {
//     var stripe = Stripe('pk_test_jTcvZUaY0zm2YBTKixbaWZI700OFTYDBaK');
//
//     var elements = stripe.elements();
//     var cardElement = elements.create('card');
//     var cardholderName = document.getElementById('cardholder-name');
//     var cardButton = document.getElementById('card-button');
//     var clientSecret = cardButton.dataset.secret;
//
//     cardButton.addEventListener('click', function(ev) {
//
//         stripe.confirmCardSetup(
//             clientSecret,
//             {
//                 payment_method: {
//                     card: cardElement,
//                     billing_details: {
//                         name: cardholderName.value,
//                     },
//                 },
//             }
//         ).then(function(result) {
//             if (result.error) {
//                 // Display error.message in your UI.
//             } else {
//                 // The setup has succeeded. Display a success message.
//             }
//         });
//     });
//     cardElement.mount('#card-element');

    stripeElements();
});

