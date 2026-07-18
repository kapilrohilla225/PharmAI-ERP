class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search(fields = []) {
    if (this.queryString.search) {
      const keyword = {
        $or: fields.map((field) => ({
          [field]: {
            $regex: this.queryString.search,

            $options: "i",
          },
        })),
      };

      this.query = this.query.find(keyword);
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };

    const excluded = ["search", "page", "limit", "sort"];

    excluded.forEach((el) => delete queryObj[el]);

    this.query = this.query.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort.split(",").join(" "));
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;

    const limit = Number(this.queryString.limit);

    if (limit && limit > 0) {
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
    }

    return this;
  }
}

module.exports = ApiFeatures;
