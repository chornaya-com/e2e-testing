enum Environments {
    Stage = 'Stage',
    Prod = 'Prod',
}
const mainPageUrls = {
    [Environments.Stage]: 'https://www.faceit-stage.com',
    [Environments.Prod]: 'https://www.faceit.com',
}

const environment = !!process.env.PRODUCTION ? Environments.Prod : Environments.Stage;

export const faceitUrl = mainPageUrls[environment];
