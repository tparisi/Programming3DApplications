(function()
{
    // The CocoonJS must exist before creating the extension.
    if (typeof window.CocoonJS === 'undefined' || window.CocoonJS === null) throw("The CocoonJS object must exist and be valid before creating any extension object.");

    /**
    * This namespace represents the CocoonJS In-App Purchase extension.
    * @namespace
    */
    CocoonJS.Store = {};

    CocoonJS.Store.nativeExtensionObjectAvailable = CocoonJS.nativeExtensionObjectAvailable && typeof window.ext.IDTK_SRV_STORE !== 'undefined';

	/**
	* The data structure that represents the information of a product in the store.
	* @namespace
	* @constructor
	* @param {string} The id of the product.
	* @param {string} The alias of the product.
	* @param {CocoonJS.Store.ProductType} The product type @see CocoonJS.Store.ProductType.
	* @param {string} The title of the product.
	* @param {string} The description of the product.
	* @param {string} The localized price of the product.
	* @param {string} The URL of the asset to be downloaded for this purchase.
	*/
	CocoonJS.Store.ProductInfo = function(productAlias, productId, productType, title, description, price, localizedPrice, downloadURL)
	{
		/**
		* The id of the product.
		* @field
		* @type string
		*/
		this.productId = productId;

		/**
		* The alias of the product.
		* @field
		* @type string
		*/
		this.productAlias = productAlias;

		/**
		* The product type @see CocoonJS.Store.ProductType
		* @field
		* @type CocoonJS.Store.ProductType
		*/
		this.productType = productType;

		/**
		* The title of the product.
		* @field
		* @type string
		*/
		this.title = title;

		/**
		* The description of the product.
		* @field
		* @type string
		*/
		this.description = description;

		/**
		* The price of the product.
		* @field
		* @type string
		*/
		this.price = price;

		/**
		* The localized price of the product.
		* @field
		* @type string
		*/
		this.localizedPrice = localizedPrice;

		/**
		* The URL of the asset to be downloaded for this purchase.
		* @field
		* @type string
		*/
		this.downloadURL = downloadURL;

		return this;
	};

	/**
    * The predefined possible states of a purchase.
    * @namespace 
    */
	CocoonJS.Store.ProductType = 
	{
		/**
		* A consumable product. See platform documentation for further information.
		*/
	    CONSUMABLE : 0,

		/**
		* A non-cunsumable product. . See platform documentation for further information.
		*/
	    NON_CONSUMABLE : 1,

	    /**
		* An auto-renewable subscription. See platform documentation for further information.
		*/
	    AUTO_RENEWABLE_SUBSCRIPTION : 2,

	    /**
		* A free subscription. See platform documentation for further information.
		*/
	    FREE_SUBSCRIPTION : 3,

	    /**
		* A non-renewable subscription. See platform documentation for further information.
		*/
	    NON_RENEWABLE_SUBSCRIPTION : 4
	};

	/**
    * The predefined possible store types.
    * @namespace 
    */
	CocoonJS.Store.StoreType = 
	{
		/**
		* Apple AppStore
		*/
	    APP_STORE : 0,

	    /**
	    * Android Play Store
	    */
	    PLAY_STORE : 1,

		/**
		* Mock Store
		*/
		MOCK_STORE : 2,

		/**
	    * Amazon AppStore
	    */
	    CHROME_STORE : 3,

	    /**
	    * Amazon AppStore
	    */
	    AMAZON_STORE : 4,

	    /**
	    * Nook Store
	    */
	    NOOK_STORE : 5
	};

	/**
	* The data structure that represents the information of a purchase.
	* @namespace
	* @constructor
	* @param {string} The transaction id of a purchase.
	* @param {string} The time when the purchase was done in seconds since 1970.
	* @param {CocoonJS.Store.PurchaseState} The state of the purchase. @see CocoonJS.Store.PurchaseState
	* @param {string} The product id related to this purchase.
	* @param {number} The number of products of the productId kind purchased in this transaction.
	*/
	CocoonJS.Store.PurchaseInfo = function(transactionId, purchaseTime, purchaseState, productId, quantity)
	{
		/**
		* The transaction id of a purchase.
		* @field
		* @type string
		*/
		this.transactionId = transactionId;

		/**
		* The time when the purchase was done in seconds since 1970.
		* @field
		* @type string
		*/
		this.purchaseTime = purchaseTime;

		/**
		* The state of the purchase. @see CocoonJS.Store.PurchaseState
		* @field
		* @type CocoonJS.Store.PurchaseState
		*/
		this.purchaseState = purchaseState;

		/**
		* The product id related to this purchase.
		* @field
		* @type string
		*/
		this.productId = productId;

		/**
		* The number of products of the productId kind purchased in this transaction.
		* @field
		* @type number
		*/
		this.quantity = quantity;

		return this;
	};

	/**
    * The predefined possible states of a purchase.
    * @namespace 
    */
	CocoonJS.Store.PurchaseState = 
	{
		/**
		* The product has been successfully purchased. The transaction has ended successfully.
		*/
	    PURCHASED : 0,

		/**
		* The purchase has been canceled.
		*/
	    CANCELED : 1,

	    /**
		* The purchase has been refunded.
		*/
	    REFUNDED : 2,

	    /**
		* The purchase (subscriptions only) has expired and is no longer valid.
		*/
	    EXPIRED : 3
	};

	/**
	* Gets the name of the native store implementation. 
	* @return {CocoonJS.Store.StoreType} The store type
	* @function
	*/ 
	CocoonJS.Store.getStoreType = function()
	{
		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "getStoreType", arguments);
		}
	};

	/**
	* Initialize the service with service level initialization parameters.
	* @function
	* @param {object} An object with the required initialization parameters for the service.
	*/
	CocoonJS.Store.requestInitialization = function(parameters)
	{
        if (typeof parameters === "undefined") 
        {
            parameters = {};
        }
        else
        {
        	if (parameters['managed'] !== undefined) parameters['remote'] = parameters['managed'];
        	if (parameters['sandbox'] !== undefined) parameters['debug'] = parameters['sandbox'];
        }

		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "requestInitialization", arguments, true);
		}
	};

	/**
	* Starts the Store Service. 
	* This will make the system to initialize the Store Service and probably Store callbacks will start to be received after calling this method so you should have set your event handler before calling this method so don't lose any callback.
	* @function
	*/ 
	CocoonJS.Store.start = function()
	{
		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "start", arguments);
		}
	};

	/**
	* This method allows you to check is the  Store service is available in this platform. 
	* Not all iOS and Android devices will have the Store service available so you should check if it is before calling any other method.
	* @function
	* @return {boolean} True if the service is available and false otherwise.
	*/ 
	CocoonJS.Store.canPurchase = function()
	{
		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "canPurchase", arguments);
		}
	};

	/**
	* Fetches the products from the CocoonJS Cloud Compiling service store configuration. 
	* The request is monitored using the {@link CocoonJS.Store.onProductsFetchStarted}, {@link CocoonJS.Store.onProductsFetchCompleted} and {@link CocoonJS.Store.onProductsFetchFailed} event handlers.
	* @deprecated You should now use fetchProductsFromStore. We don't support cloud products now.
	* @function
	* @see CocoonJS.Store.onProductsFetchStarted
	* @see CocoonJS.Store.onProductsFetchCompleted
	* @see CocoonJS.Store.onProductsFetchFailed
	*/ 
	CocoonJS.Store.fetchProductsFromServer = function()
	{
		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "fetchProductsFromServer", arguments, true);
		}
	};

	/**
	* Fetches the products information from the Store. 
	* The request is monitored using the {@link CocoonJS.Store.onProductsFetchStarted}, {@link CocoonJS.Store.onProductsFetchCompleted} and {@link CocoonJS.Store.onProductsFetchFailed} event handlers.
	* @function
	* @param {array} productIds An array with the ids of the products to retrieve information from.
	* @see CocoonJS.Store.onProductsFetchStarted
	* @see CocoonJS.Store.onProductsFetchCompleted
	* @see CocoonJS.Store.onProductsFetchFailed
	*/ 
	CocoonJS.Store.fetchProductsFromStore = function(productIds)
	{
		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "fetchProductsFromStore", arguments, true);
		}
	};

	/**
	* Finish a purchase transaction and removes the transaction from the transaction queue. 
	* This method must be called after a purchase finishes successfully and the  {@link CocoonJS.Store.onProductPurchaseCompleted} callback has been received. 
	* If the purchase includes some asset to download from an external server this method must be called after the asset has been successfully downloaded. 
	* If you do not finish the transaction because the asset has not been correctly downloaded the {@link CocoonJS.Store.onProductPurchaseStarted} method will be called again later on.
	* @function
	* @param {string} transactionId The transactionId of the purchase to finish.
	*/ 
	CocoonJS.Store.finishPurchase = function(transactionId)
	{
		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "finishPurchase", arguments, true);
		}
	};

	/**
	* Consumes a purchase. This makes that product to be purchasable again. 
	* @function
	* @param {string} transactionId The transaction Id of the purchase to consume.
	* @param {string} productId The product Id of the product to be consumed.
	*/ 
	CocoonJS.Store.consumePurchase = function(transactionId, productId)
	{
		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "consumePurchase", arguments, true);
		}
	};

	/**
	* Request a product purchase given it's product id. 
	* The request is monitored using the {@link CocoonJS.Store.onPurchaseProductStarted}, {@link CocoonJS.Store.onProductPurchaseStarted} and {@link CocoonJS.Store.onProductPurchaseFailed} event handlers.
	* @function
	* @param {string} productId The id or alias of the product to be purchased.
	* @see CocoonJS.Store.onProductPurchaseStarted
	* @see CocoonJS.Store.onProductPurchaseCompleted
	* @see CocoonJS.Store.onProductPurchaseFailed
	*/ 
	CocoonJS.Store.purchaseProduct = function(productId)
	{
		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "purchaseFeature", arguments, true);
		}
	};

	/**
	* Request a product purchase given it's product id showing a modal progress dialog. 
	* The request is monitored using the {@link CocoonJS.Store.onProductPurchaseStarted}, {@link CocoonJS.Store.onProductPurchaseCompleted} and {@link CocoonJS.Store.onProductPurchaseFailed} event handlers.
	* @function
	* @param {string} productId The id or alias of the product to be purchased.
	* @see CocoonJS.Store.onProductPurchaseStarted
	* @see CocoonJS.Store.onProductPurchaseCompleted
	* @see CocoonJS.Store.onProductPurchaseFailed
	*/ 
	CocoonJS.Store.puchaseProductModal = function(productId)
	{
		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "purchaseFeatureModal", arguments, true);
		}
	};

	/**
	* Request the purchase of a product given it's product id showing a dialog with a preview of the product (title and description). 
	* The request is monitored using the {@link CocoonJS.Store.onProductPurchaseStarted}, {@link CocoonJS.Store.onProductPurchaseCompleted} and {@link CocoonJS.Store.onProductPurchaseFailed} event handlers.
	* @function
	* @param {string} productId The id or alias of the product to be purchased.
	* @see CocoonJS.Store.onProductPurchaseStarted
	* @see CocoonJS.Store.onProductPurchaseCompleted
	* @see CocoonJS.Store.onProductPurchaseFailed
	*/ 
	CocoonJS.Store.purchaseProductModalWithPreview = function(productId)
	{
		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "purchaseFeatureModalWithPreview", arguments, true);
		}
	};

	/**
	* Returns if a product has been already purchased or not. 
	* @function
	* @param {string} productId The product id or alias of the product to be checked.
	* @returns {boolean} A flag that indicates whether the product has been already purchased (true) or not (false).
	*/
	CocoonJS.Store.isProductPurchased = function(productId)
	{
		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "isFeaturePurchased", arguments);
		}
	};

	/**
	* Restores all the purchases from the platform's market. 
	* For each already purchased product {@link CocoonJS.Store.onPurchaseProductStarted}, {@link CocoonJS.Store.onPurchaseProductCompleted} and {@link CocoonJS.Store.onPurchaseProductFailed} event handlers are called again
	* @function
	* @see CocoonJS.Store.onRestorePurchasesStarted
	* @see CocoonJS.Store.onRestorePurchasesCompleted
	* @see CocoonJS.Store.onRestorePurchasesFailed
	*/
	CocoonJS.Store.restorePurchases = function()
	{
		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "restorePurchases", arguments, true);
		}
	};

	/**
	* Restores all the purchases from the platform's market showing a modal progress dialog. 
	* For each already purchased product {@link CocoonJS.Store.onPurchaseProductStarted}, {@link CocoonJS.Store.onPurchaseProductCompleted} and {@link CocoonJS.Store.onPurchaseProductFailed} event handlers are called again
	* @function
	* @see CocoonJS.Store.onRestorePurchasesStarted
	* @see CocoonJS.Store.onRestorePurchasesCompleted
	* @see CocoonJS.Store.onRestorePurchasesFailed
	*/
	CocoonJS.Store.restorePurchasesModal = function()
	{
		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "restorePurchasesModal", arguments, true);
		}
	};

	/**
	* Returns all the products available to be purchased.
	* @function
	* @returns {array} An array with  all the {@link CocoonJS.Store.ProductInfo} objects available for purchase.
	*/
	CocoonJS.Store.getProducts = function()
	{
		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "getProducts", arguments);
		}
	};

	/**
	* Adds a product to the products local DB. 
	* @function
	* @param {CocoonJS.Store.ProductInfo} product The product to be added to the local products DB.
	*/
	CocoonJS.Store.addProduct = function(product)
	{
		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "addProduct", arguments);
		}
	};

	/**
	* Removes a product from the products local DB given its productId. 
	* @function
	* @param {string} productId The product or alias of the product to be removed from the local products DB.
	*/
	CocoonJS.Store.removeProduct = function(productId)
	{
		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "removeProduct", arguments);
		}
	};

	/**
	* Returns all the locally stored purchases.
	* @function
	* @returns {array} An array with all the {@link CocoonJS.Store.PurchaseInfo} completed purchases.
	*/
	CocoonJS.Store.getPurchases = function()
	{
		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "getPurchases", arguments);
		}
	};

	/**
	* Adds a purchase to the local purchases DB. 
	* @function
	* @param {CocoonJS.Store.StorePurchase} purchase The purchase to be added.
	*/ 
	CocoonJS.Store.addPurchase = function(purchase)
	{
		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "addPurchase", arguments);
		}
	};

	/**
	* Removes a purchase from the local purchases DB given it's transaction id. 
	* @function
	* @param {string} transactionId The id of the transaction to be removed.
	*/ 
	CocoonJS.Store.removePurchase = function(transactionId)
	{
		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "removePurchase", arguments);
		}
	};

	/**
	* (TESTING ONLY) Simulate a purchase cancel. 
	* This method is not allowed in production services and will only work in Mocks. 
	* The request is monitored using the {@link CocoonJS.Store.onPurchaseProductStarted}, {@link CocoonJS.Store.onProductPurchaseStarted} and {@link CocoonJS.Store.onProductPurchaseFailed} event handlers.
	* @function
	* @param {string} transactionId The transactionId of the purchase to be canceled.
	*/
	CocoonJS.Store.cancelPurchase = function(transactionId)
	{
		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "cancelPurchase", arguments);
		}
	};

	/**
	* (TESTING ONLY) Simulate a purchase refundment. 
	* This method is not allowed in production services and will only work in Mocks. 
	* The request is monitored using the {@link CocoonJS.Store.onPurchaseProductStarted}, {@link CocoonJS.Store.onProductPurchaseStarted} and {@link CocoonJS.Store.onProductPurchaseFailed} event handlers.
	* @function
	* @param {string} transactionId The transactionId of the purchase to be refunded.
	*/
	CocoonJS.Store.refundPurchase = function(transactionId)
	{
		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "refundPurchase", arguments);
		}
	};

	/**
	* (TESTING ONLY) Simulate a purchase expiration. 
	* This method is not allowed in production services and will only work in Mocks. 
	* The request is monitored using the {@link CocoonJS.Store.onPurchaseProductStarted}, {@link CocoonJS.Store.onProductPurchaseStarted} and {@link CocoonJS.Store.onProductPurchaseFailed} event handlers.
	* @function
	* @param {string} transactionId The transactionId of the purchase to be expired.
	*/
	CocoonJS.Store.expirePurchase = function(transactionId)
	{
		if (CocoonJS.Store.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_STORE", "expirePurchase", arguments);
		}
	};

	/**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when the products fetch has started.
    * The callback function receives no parameters.
    * @static
    * @event
    */
	CocoonJS.Store.onProductsFetchStarted = new CocoonJS.EventHandler("IDTK_SRV_STORE", "Store", "onProductsFetchStarted");

    /**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when the products fetch has completed.
    * The callback function receives a parameter with an the valid products array.
    * @static
    * @event
    * @param {array} validProducts An array of {@link CocoonJS.Store.ProductInfo} objects representing all the valid fetched products.
    */
	CocoonJS.Store.onProductsFetchCompleted = new CocoonJS.EventHandler("IDTK_SRV_STORE", "Store", "onProductsFetchCompleted"); 

    /**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when the products fetch has failed.
    * The callback function receives an error message as a parameter.
    * @static
    * @event
    * @param {string} errorMessage The error message.
    */
	CocoonJS.Store.onProductsFetchFailed = new CocoonJS.EventHandler("IDTK_SRV_STORE", "Store", "onProductsFetchFailed"); 

    /**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when the purchase of a product starts.
    * The callback function receives a parameters with the information of the purchased product @see CocoonJS.Store.ProductInfo.
    * @static
	* @event
    * @param {string} productId The product id of the product being purchased.
    */
	CocoonJS.Store.onProductPurchaseStarted = new CocoonJS.EventHandler("IDTK_SRV_STORE", "Store", "onProductPurchaseStarted"); 

	/**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when a request for purchase verification has been received from the Store.
    * The callback function receives two parameters, one with the productId of the purchased product and another one with a JSON object containing the data to be verified.
    * In Andorid this JSON object will containt two keys: signedData and signature. You will need that information to verify the purchase against the backend server.
    * @static
    * @event
    * @param {string} productId The product id of the product to be verified.
    * @param {string} data The string with the data to be verified.
    */
	CocoonJS.Store.onProductPurchaseVerificationRequestReceived = new CocoonJS.EventHandler("IDTK_SRV_STORE", "Store", "onProductPurchaseVerificationRequestReceived");

    /**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when the purchase of a product succeeds.
    * The callback function receives as parameter the information of the purchase {@see CocoonJS.Store.PurchaseInfo}.
    * @static
    * @event
    * @param {CocoonJS.Store.PurchaseInfo} purchaseInfo The purchase info.
    */
	CocoonJS.Store.onProductPurchaseCompleted = new CocoonJS.EventHandler("IDTK_SRV_STORE", "Store", "onProductPurchaseCompleted"); 

    /**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when the purchase of a product fails.
    * The callback function receives a parameters with the product id and an error message.
    * @static
    * @event
    * @param {string} productId The product id.
    * @param {string} msg The error message.
    */
	CocoonJS.Store.onProductPurchaseFailed = new CocoonJS.EventHandler("IDTK_SRV_STORE", "Store", "onProductPurchaseFailed"); 

    /**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when the restore purchases operation has started.
    * The callback function receives no parameters.
    * @static
    * @event
    */
	CocoonJS.Store.onRestorePurchasesStarted = new CocoonJS.EventHandler("IDTK_SRV_STORE", "Store", "onRestorePurchasesStarted"); 

    /**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when the restore purchases operation has completed.
    * The callback function receives no parameters.
    * @static
    * @event
    */
	CocoonJS.Store.onRestorePurchasesCompleted = new CocoonJS.EventHandler("IDTK_SRV_STORE", "Store", "onRestorePurchasesCompleted"); 

	/**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when the restore purchases operation has failed.
    * The callback function receives an error message as a parameter.
    * @static
    * @event
    * @param {string} errorMessage The error message.
    */
	CocoonJS.Store.onRestorePurchasesFailed = new CocoonJS.EventHandler("IDTK_SRV_STORE", "Store", "onRestorePurchasesFailed");

	/**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when the consume purchase operation has started.
    * @static
    * @event
    * @param {string} transactionId The transaction id of the purchase being consumed.
    */
	CocoonJS.Store.onConsumePurchaseStarted = new CocoonJS.EventHandler("IDTK_SRV_STORE", "Store", "onConsumePurchaseStarted"); 

    /**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when the consume purchase operation has completed.
    * @static
    * @event
    * @param {string} transactionId The transaction id of the consumed purchase.
    */
	CocoonJS.Store.onConsumePurchaseCompleted = new CocoonJS.EventHandler("IDTK_SRV_STORE", "Store", "onConsumePurchaseCompleted"); 

	/**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when the consume purchase operation has failed.
    * @static
    * @event
    * @param {string} transactionId The transaction id of the purchase that couldn't be consumed.
    * @param {string} errorMessage The error message.
    */
	CocoonJS.Store.onConsumePurchaseFailed = new CocoonJS.EventHandler("IDTK_SRV_STORE", "Store", "onConsumePurchaseFailed");

})();