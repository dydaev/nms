import localStor from '../../../libs/localStore';

export const GET = (req, res) => {
    res.send(localStor.get('a1'));
};