import {
    getSolidDataset,
    getThing,
    setThing,
    getStringNoLocale,
    setStringNoLocale,
    saveSolidDatasetAt
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { VCARD } from "@inrupt/vocab-common-rdf";

// Sets default solid identity provider
const SOLID_IDENTITY_PROVIDER = "https://solidcommunity.net";

const session = new Session();

// Defines page elements
const buttonLogin = document.getElementById("btnLogin");
const buttonShowDetails = document.getElementById("btnShowDetails");


// Starts login calls session.login() function.
async function login() {
    console.log("login time")
    if (!session.info.isLoggedIn) {
        await session.login({
            oidcIssuer: SOLID_IDENTITY_PROVIDER,
            clientName: "Inrupt tutorial client app",
            redirectUrl: window.location.href
        });
    }
}

// login Redirect. Call session.handleIncomingRedirect() function.
// When redirected after login, finish the process by retrieving session information.
async function handleRedirectAfterLogin() {
    await session.handleIncomingRedirect(window.location.href);
    if (session.info.isLoggedIn) {
        // Update the page with the status.
        document.getElementById(
            "labelStatus"
        ).innerHTML = `Your session is logged in with the WebID [<a target="_blank" href="${session.info.webId}">${session.info.webId}</a>].`;
        document.getElementById("labelStatus").setAttribute("role", "alert");
        document.getElementById("webID").value = session.info.webId;
    }
}

async function displayCardInfo(){
    const webID = session.info.webId;

    console.log(webID)

    const profileUrl = new URL(webID);
    profileUrl.hash = "";
    console.log(profileUrl)

    let myDataset = await getSolidDataset(profileUrl.href,{
        fetch: session.fetch
    });

    let profile = getThing(myDataset, webID)
    const fullName = getStringNoLocale(profile, VCARD.fn)
    const organization = getStringNoLocale(profile, VCARD.organization_name)

    console.log(fullName)
    console.log(organization)

    const pName = document.getElementById("p1")
    const oName = document.getElementById("p2")
    pName.innerHTML = fullName
    oName.innerHTML = organization

}


handleRedirectAfterLogin();

buttonLogin.onclick = function () {
    login();
};

buttonShowDetails.onclick = function () {
    displayCardInfo();
}




