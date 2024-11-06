import { ObjectId } from "mongodb";

class publisherService {
  constructor(client) {
    this.Publisher = client.db().collection("publishers");
  }

  extractUserData(payload) {
    const Publisher = {
      MaNXB: payload.MaNXB,
      TenNXB: payload.TenNXB,
      DiaChi: payload.DiaChi,
    };

    return Publisher;
  }

  async generateMaNXB() {
    const lastPublisher = await this.Publisher.find()
      .sort({ MaNXB: -1 })
      .limit(1)
      .toArray();

    let newMaNXB = "NXB0000";

    if (lastPublisher.length > 0) {
      const lastMaNXB = lastPublisher[0].MaNXB;
      const numberPart = parseInt(lastMaNXB.slice(3));
      newMaNXB = "NXB" + String(numberPart + 1).padStart(4, "0");
    }

    return newMaNXB;
  }

  async createPublisher(payload) {
    const { TenNXB } = payload;

    const publisherExits = await this.Publisher.findOne({ TenNXB });

    if (publisherExits) {
      return {
        statusCode: 1,
        message: "Nhà xuất bản đã tồn tại",
      };
    }

    const MaNXB = await this.generateMaNXB();

    try {
      const Publisher = this.extractUserData(payload);
      Publisher.MaNXB = MaNXB;

      await this.Publisher.insertOne(Publisher);

      return {
        statusCode: 0,
        message: "Thêm nhà xuất bản thành công",
      };
    } catch (error) {
      console.error(error);

      return {
        statusCode: 2,
        message: "Thêm nhà xuất bản thất bại",
      };
    }
  }

  async getAllPublishers() {
    try {
      const publishers = await this.Publisher.find().toArray();
      return publishers;
    } catch (error) {
      return {
        statusCode: -1,
        message: error.message,
      };
    }
  }

  async getPublisherById(id) {
    try {
      const publisher = await this.Publisher.findOne({ _id: new ObjectId(id) });

      return publisher;
    } catch (error) {
      return {
        statusCode: -1,
        message: error.message,
      };
    }
  }

  async updatePublisher(id, payload) {
    try {
      const res = await this.Publisher.updateOne(
        { _id: new ObjectId(id) },
        { $set: payload }
      );

      if (!res) {
        return {
          statusCode: 2,
          message: "Có lỗi xảy ra khi cập nhật nhà xuất bản",
        };
      }

      return {
        statusCode: 0,
        message: "Cập nhật nhà xuất bản thành công",
      };
    } catch (error) {
      return {
        statusCode: -1,
        message: error.message,
      };
    }
  }

  async deletePublisher(id) {
    try {
      const res = await this.Publisher.deleteOne({ _id: new ObjectId(id) });

      if (!res) {
        return {
          statusCode: 2,
          message: "Có lỗi xảy ra khi xóa nhà xuất bản",
        };
      }

      return {
        statusCode: 0,
        message: "Xóa nhà xuất bản thành công",
      };
    } catch (error) {
      return {
        statusCode: -1,
        message: error.message,
      };
    }
  }
}

export default publisherService;
