import ApiError from "../api-error.js";
import LendingService from "../services/lending.service.js";
import MongoDB from "../util/mongodb.util.js";

class LendingController {
  static async createLending(req, res, next) {
    const { MaDocGia, MaSach } = req.body;

    console.log(req.body);

    if (!MaDocGia || !MaSach) {
      return next(new ApiError(400, "MaDocGia and MaSach are required"));
    }

    try {
      const lendingService = new LendingService(MongoDB.client);

      const response = await lendingService.createLending(req.body);

      if (response.statusCode === 0) {
        return res.status(201).json({ data: response });
      } else if (response.statusCode === 1) {
        return res.status(300).json({ data: response.message });
      } else {
        return res.status(500).json({ data: response });
      }
    } catch (error) {
      console.error(error);

      return next(
        new ApiError(500, "An error occurred while creating the lending")
      );
    }
  }

  static async getAllLendings(req, res, next) {
    try {
      const lendingService = new LendingService(MongoDB.client);
      const lendings = await lendingService.getAllLendings();

      return res.status(200).json(lendings);
    } catch (error) {
      console.error(error);

      return next(
        new ApiError(500, "An error occurred while getting all lendings")
      );
    }
  }

  static async getLendingById(req, res, next) {
    const { id } = req.params;

    try {
      const lendingService = new LendingService(MongoDB.client);
      const lending = await lendingService.getLendingById(id);

      return res.status(200).json(lending);
    } catch (error) {
      console.error(error);

      return next(
        new ApiError(500, "An error occurred while getting the lending")
      );
    }
  }

  static async updateLendingById(req, res, next) {
    const { id } = req.params;
    const { MaDocGia, MaSach } = req.body;

    if (!MaDocGia || !MaSach) {
      return next(
        new ApiError(400, "MaDocGia and MaSach are required")
      );
    }

    try {
      const lendingService = new LendingService(MongoDB.client);
      const response = await lendingService.updateLending(id, req.body);

      if (response.statusCode === 0) {
        return res.status(200).json({ data: response });
      } else {
        return res.status(500).json({ data: response });
      }
    } catch (e) {
      console.error(e);

      return next(
        new ApiError(500, "An error occurred while updating the lending")
      );
    }
  }

  static async deleteLendingById(req, res, next) {
    const { id } = req.params;

    try {
      const lendingService = new LendingService(MongoDB.client);
      const response = await lendingService.deleteLending(id);

      if (response.statusCode === 0) {
        return res.status(200).json({ data: response });
      } else {
        return res.status(500).json({ data: response });
      }
    } catch (error) {
      console.error(error);

      return next(
        new ApiError(500, "An error occurred while deleting the lending")
      );
    }
  }
}

export default LendingController;
