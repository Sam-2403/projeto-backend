const app = require("./app-express.js");
const { Product, ProductImage } = require("../models/models.js");

// Rota para testar o funcionamento
app.get("/", (req, res) => {
  res.send("Olá, mundo");
});

// cRud - READ (Busca com query e limite)
app.get("/v1/product/search", async (req, res) => {
  try {
    console.log(req.query); // Exibe os parâmetros de busca na query
    const produtos = await Product.findAll({ limit: 30 });
    res.send(produtos);
  } catch (error) {
    res.status(500).send({ mensagem: "Erro ao buscar produtos", erro: error });
  }
});

// cRud - READ (Buscar produto por ID)
app.get("/v1/product/:id", async (req, res) => {
  try {
    console.log("request.url", req.url); // debug
    console.log("request.params.id", req.params.id);

    const produto = await Product.findOne({ where: { id: req.params.id } });
    if (produto) {
      res.send(produto);
    } else {
      res.status(404).send({ mensagem: "Produto não encontrado" });
    }
  } catch (error) {
    res.status(500).send({ mensagem: "Erro ao buscar produto", erro: error });
  }
});

// cRud - READ (Listar todos os produtos)
app.get("/v1/product", async (req, res) => {
  try {
    console.log("request.url", req.url); // debug
    const produtos = await Product.findAll();
    res.send(produtos);
  } catch (error) {
    res.status(500).send({ mensagem: "Erro ao listar produtos", erro: error });
  }
});

// Crud - CREATE (Criar novo produto e associar categorias/imagens)
app.post("/v1/product", async (req, res) => {
  try {
    console.log("request.url", req.url); // debug
    console.log("request.body", req.body);

    const productCreated = await Product.create(req.body);
    console.log("productCreated", productCreated);

    // Adicionar categorias ao produto
    if (req.body.category_ids) {
      await productCreated.addCategories(req.body.category_ids);
    }

    // Adicionar imagens ao produto
    const imagesParsed = req.body.images.map((image) => ({
      product_id: productCreated.id,
      path: image.content,
    }));
    const imagesCreated = await ProductImage.bulkCreate(imagesParsed);

    res.status(201).send({ productCreated, imagesCreated });
  } catch (error) {
    res.status(400).send({ mensagem: "Erro ao criar produto", erro: error });
  }
});

// crUd - UPDATE (Atualizar um produto existente)
app.put("/v1/product/:id", async (req, res) => {
  try {
    console.log("request.url", req.url); // debug
    console.log("request.body", req.body);

    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated) {
      res.send({ mensagem: "Produto atualizado com sucesso" });
    } else {
      res.status(404).send({ mensagem: "Produto não encontrado" });
    }
  } catch (error) {
    res.status(500).send({ mensagem: "Erro ao atualizar produto", erro: error });
  }
});

// cruD - DELETE (Excluir um produto por ID)
app.delete("/v1/product/:id", async (req, res) => {
  try {
    console.log("request.url", req.url); // debug
    const deleted = await Product.destroy({ where: { id: req.params.id } });

    if (deleted) {
      res.send(`Produto excluído com sucesso. Quantidade de linhas afetadas: ${deleted}`);
    } else {
      res.status(404).send({ mensagem: "Produto não encontrado" });
    }
  } catch (error) {
    res.status(500).send({ mensagem: "Erro ao excluir produto", erro: error });
  }
});
