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

    getProducts() {

        return axios.get(
            '/api/products/'
        );
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