import mongoose, { Schema, model, models } from "mongoose";

const chronologyEntrySchema = new Schema(
  {
    time: { type: String, default: "" },
    event: { type: String, default: "" },
  },
  { _id: false },
);

export const RailwaySchema = new Schema({
  id: { type: Number, required: true, unique: true }, // 台1線的編號 40100
  name: String, // 台1線
  region: { type: String, default: "" },
  co: Number,
  historySummary: { type: String, default: "" },
  chronology: { type: [chronologyEntrySchema], default: [] },
  district: [
    {
      districtID: { type: Number, required: true },
      districtName: { type: String, required: true },
      geometry: {
        type: { type: String, enum: ["LineString"], default: "LineString" },
        coordinates: { type: [[Number]], default: [] },
      },
    },
  ],
});

// 如果 model 已經存在就直接用，不存在就建立一個新的
const Railway = models.Railway || model("Railway", RailwaySchema);
export default Railway;
