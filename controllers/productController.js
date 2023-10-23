const { products, pages } = require("../database/models");
require("dotenv").config();

const addProduct = async (req, res) => {
  const { page, title, description } = await req.body;

  const findProduct = await products.findOne({
    where: {
      title: title,
    },
  });

  if (findProduct) return res.json("product déjà ajouté");

  const findPage = await pages.findOne({
    where: {
      page: page,
    },
  });

  if (!findPage) return res.json("Page non trouvé");

  if (page && title && description) {
    const result = await products.create({
      pageId: findPage.ID_page,
      title,
      description,
    });

    if (result) {
      res.json("Produit ajouté");
    }
  }
};

const uploadProductImage = async (req, res) => {
  let png, pub, gallery, productUpload;
  const { id, title } = req.body;

  if (id) {
    productUpload = await products.findOne({
      where: {
        ID_product: id,
      },
    });
  } else if (!id && title) {
    productUpload = await products.findOne({
      where: {
        title: title,
      },
    });
  }else {
    res.json("Aucun")
  }

  if (!productUpload) return res.json("Non trouvé");

  if (req?.files?.png) {
    if (req.files.png[0].mimetype.split("/")[0] == "image") {
      png = `${process.env.SERVER_PATH}/img/png/${req.files.png[0].filename}`;
    }
  }
  if (req?.files?.pub) {
    if (req.files.pub[0].mimetype.split("/")[0] == "image") {
      pub = `${process.env.SERVER_PATH}/img/pub/${req.files.pub[0].filename}`;
    }
  }
  if (req?.files?.gallery) {
    const galleryArray = new Array();

    req.files.gallery.map((file) => {
      console.log(file.mimetype.split("/")[0] == "image");
      if (file.mimetype.split("/")[0] == "image") {
        galleryArray.push(
          `${process.env.SERVER_PATH}/img/gallery/${file.filename}`
        );
      }
    });
    gallery = galleryArray.join(",");
  }

  if (png) productUpload.png = png;
  if (pub) productUpload.pub = pub;
  if (gallery) productUpload.gallery = gallery;

  const result = await productUpload.save();

  if(result){
    res.json("Upload product")
  }
};

const updateProduct = async (req, res) => {
  const { id, title, description, page } = await req.body;

  if (id) {
    const product = await products.findOne({
      where: {
        ID_product: id,
      },
    });
    if (!product) return res.json("Produit n'existe pas");

    const findPage = await pages.findOne({
      where: {
        page: page,
      },
    });

    if (!findPage) return res.json("Page non trouvé");

    if (title && description) {
      product.set({ pageId: findPage.ID_page, title, description });
    }

    const result = await product.save();

    if (result) {
      res.json("Produit modifié");
    }
  } else {
    res.json("pas de id");
  }
};

const getProducts = async (req, res) => {
  const allProducts = await products.findAll({
    include: [
      {
        model: pages,
        required: true,
        attributes: ["page", "home"],
      },
    ],
  });

  if (allProducts) {
    res.json(allProducts);
  }
};

const deleteProduct = async (req, res) => {
  const id = await req?.params?.id;

  if (id) {
    const result = await products.destroy({
      where: {
        ID_product: id,
      },
    });

    if (result) {
      res.json("supprimé");
    }
  } else res.json("Pas d'identifiant");
};

const getProductByPage = async(req, res)=>{
  const id = await req?.params?.id;

  const allProducts = await products.findAll({
    where: {
      pageId: id,
    }
  });

  if (allProducts) {
    res.json(allProducts);
  }
}

module.exports = { addProduct, updateProduct, getProducts, deleteProduct, uploadProductImage, getProductByPage };
