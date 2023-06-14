async function seedNewUserForTest() {
    const nickname = `e2e_user_${Number.parseInt(Math.random()*1000)}`;
    const email = `${nickname}@gmail.com`;
    const password = "e2e_password123";

    const userData = {
        email: `${nickname}@gmail.com`,
        nickname,
        password: "e2e_password123!",
        country: "gb",
        firstname: "e2eFirstname",
        lastname: "e2eLastname",
        referral: "",
        captcha_token: "10000000-aaaa-bbbb-cccc-000000000001",
        subscribe_to_all_marketing_newsletters: false,
        source: "FACEIT_CONNECT",
        birthdate: {
            date: "2",
            month: "2",
            year: "2005"
        },
        settings: {
            language: "en"
        }
    };

    const response = await fetch(`https://api.faceit-stage.com/users/v2/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });

    const data = await response.json();

    return {
        nickname,
        email,
        password,
        ...data
    }
}

(async () => {
    const user = await seedNewUserForTest();
    console.log(user);
})();