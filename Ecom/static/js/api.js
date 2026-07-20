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

/api/products/?category=2

/api/products/?subcategory=5

/api/products/?search=helmet

/api/products/?category=2&subcategory=5

/api/products/?category=2&subcategory=5&search=helmet
*/

getProducts(

    category = null,

    subcategory = null,

    search = null

){

    let url =

        '/api/products/';

    const params = [];

    /*
    --------------------------------------
    Category
    --------------------------------------
    */

    if(category){

        params.push(

            'category=' + category

        );

    }

    /*
    --------------------------------------
    Sub Category
    --------------------------------------
    */

    if(subcategory){

        params.push(

            'subcategory=' + subcategory

        );

    }

    /*
    --------------------------------------
    Search
    --------------------------------------
    */

    if(search){

        params.push(

            'search=' +

            encodeURIComponent(

                search

            )

        );

    }

    /*
    --------------------------------------
    Build Query String
    --------------------------------------
    */

    if(params.length){

        url +=

            '?' +

            params.join('&');

    }

    return axios.get(url);

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