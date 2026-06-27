/*
======================================
API SERVICE LAYER
======================================

Purpose:

Keep all API calls in one file.

Instead of:

axios.get(...)
axios.post(...)

everywhere.

We create reusable functions.
*/

/*
==================================================
GET CSRF TOKEN
==================================================
*/

function getCookie(
    name
) {

    let cookieValue = null;

    if (
        document.cookie &&
        document.cookie !== ''
    ) {

        const cookies =
            document.cookie.split(';');

        for (

            let i = 0;

            i < cookies.length;

            i++

        ) {

            const cookie =
                cookies[i].trim();

            if (

                cookie.substring(
                    0,
                    name.length + 1
                ) ===
                (
                    name + '='
                )

            ) {

                cookieValue =
                    decodeURIComponent(

                        cookie.substring(
                            name.length + 1
                        )

                    );

                break;
            }
        }
    }

    return cookieValue;
}



/*
==================================================
AXIOS CSRF CONFIG
==================================================
*/

axios.defaults.headers.common[
    'X-CSRFToken'
] = getCookie(
    'csrftoken'
);



const API = {

    /*
    -----------------------------------
    Get Categories
    -----------------------------------
    */

    getCategories() {

        return axios.get(
            '/api/categories/'
        );
    },

    /*
    -----------------------------------
    Get Products
    -----------------------------------
    */



/*
==================================================
GET HOMEPAGE BANNERS
==================================================
*/

getBanners() {

    return axios.get(

        '/api/banners/'

    );

},



   /*
==================================================
GET PRODUCTS
==================================================

Supports:

/api/products/

/api/products/?category=3

*/

getProducts(category = null) {

    let url =
        '/api/products/';

    if (category) {

        url +=
            '?category=' + category;

    }

    return axios.get(url);

},

    /*
    -----------------------------------
    Get Product Detail
    -----------------------------------
    */

    getProduct(slug) {

        return axios.get(
            `/api/products/${slug}/`
        );
    },

    getDeliveryCharges() {

    return axios.get(
        '/api/delivery-charges/'
    );
},

    /*
    -----------------------------------
    Create Order
    -----------------------------------
    */

    createOrder(orderData) {

        return axios.post(
            '/api/orders/',
            orderData,
            {
                headers: {
                    'X-CSRFToken':
                        getCSRFToken()
                }
            }
        );
    }

};

function getCSRFToken() {

    return document
        .querySelector(
            '[name=csrf-token]'
        )
        .content;
}