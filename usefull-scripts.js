/* DraftSim get list */
Array.from(document.querySelectorAll('.pick_order_tier')).map(tier => ({
    title : tier.querySelector('h2').innerText,
    cards : Array.from(tier.getElementsByClassName('pick_order_card_container')).map(c => {
        const s = c.innerText.trim().split('.');
        return {score: s[0], name: s[1].trim()};
    })
}))
