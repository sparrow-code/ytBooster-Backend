import CacheStorage from '../utils/cacheStorage.js';

const getDiscount = async (req, res) => {
    try {
        const data = CacheStorage.get().get('discount');
        res.status(200).json({ success : true,  discount : data});
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error });
    }
}

const postDiscount = async (req, res) => {
    try {
        CacheStorage.get().set('discount', parseInt(req.body.percent) );
        const data = CacheStorage.get().get('discount');
        res.status(200).json({ success : true,  discount : data});
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }
}

const putDiscount = async (req, res) => {
    try {
        CacheStorage.get().set('discount', parseInt(req.body.percent));
        const data = CacheStorage.get().get('discount');
        res.status(200).json({ success : true,  discount : data});
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }
}

const deleteDiscount = async (req, res) => {
    try {
        CacheStorage.get().delete('discount');
        res.status(200).json({ success : true,  discount : null});
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error });
    }
}

export { getDiscount, postDiscount, putDiscount, deleteDiscount  };