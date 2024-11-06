import ApiError from "../api-error.js";
import PublisherService from "../services/publisher.service.js";
import MongoDB from "../util/mongodb.util.js";

class PublisherController {
  static async createPublisher(req, res, next) {
    const { TenNXB, DiaChi } = req.body;

    if (!TenNXB || !DiaChi) {
      return next(new ApiError(400, "TenNXB, DiaChi are required"));
    }

    try {
      const publisherService = new PublisherService(MongoDB.client);

      const response = await publisherService.createPublisher({
        TenNXB,
        DiaChi,
      });

      if (response.statusCode === 0) {
        return res.status(201).json({ data: response });
      } else if (response.statusCode === 1) {
        return res.status(409).json({ data: response });
      } else {
        return res.status(500).json({ data: response });
      }
    } catch (error) {
      console.error(error);

      return next(
        new ApiError(500, "An error occurred while creating the publisher")
      );
    }
  }

  static async getAllPublishers(req, res, next) {
    try {
      const publisherService = new PublisherService(MongoDB.client);

      const publishers = await publisherService.getAllPublishers();

      return res.status(200).json(publishers);
    } catch (error) {
      console.error(error);

      return next(
        new ApiError(500, "An error occurred while getting all publishers")
      );
    }
  }

  static async getPublisherById(req, res, next) {
    const { id } = req.params;

    try {
      const publisherService = new PublisherService(MongoDB.client);

      const publisher = await publisherService.getPublisherById(id);

      if (!publisher) {
        return next(new ApiError(404, "Publisher not found"));
      }

      return res.status(200).json(publisher);
    } catch (error) {
      console.error(error);

      return next(
        new ApiError(500, "An error occurred while getting the publisher")
      );
    }
  }

  static async updatePublisher(req, res, next) {
    const { id } = req.params;
    const { TenNXB, DiaChi } = req.body;

    if (!TenNXB || !DiaChi) {
      return next(new ApiError(400, "TenNXB, DiaChi are required"));
    }

    try {
      const publisherService = new PublisherService(MongoDB.client);

      const response = await publisherService.updatePublisher(id, {
        TenNXB,
        DiaChi,
      });

      if (response.statusCode === 0) {
        return res.status(200).json({ data: response });
      } else if (response.statusCode === 1) {
        return res.status(404).json({ data: response });
      } else {
        return res.status(500).json({ data: response });
      }
    } catch (error) {
      console.error(error);

      return next(
        new ApiError(500, "An error occurred while updating the publisher")
      );
    }
  }

  static async deletePublisher(req, res, next) {
    const { id } = req.params;

    try {
      const publisherService = new PublisherService(MongoDB.client);

      const response = await publisherService.deletePublisher(id);

      if (response.statusCode === 0) {
        return res.status(200).json({ data: response });
      } else if (response.statusCode === 1) {
        return res.status(404).json({ data: response });
      } else {
        return res.status(500).json({ data: response });
      }
    } catch (error) {
      console.error(error);

      return next(
        new ApiError(500, "An error occurred while deleting the publisher")
      );
    }
  }
}

export default PublisherController;
