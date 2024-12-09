import { Console } from "@nsnanocat/util";
//import { MESSAGE_TYPE, reflectionMergePartial, BinaryReader, WireType, UnknownFieldHandler, isJsonObject, typeofJsonValue, jsonWriteOptions, MessageType } from "@protobuf-ts/runtime";
import { PDPlaceRequest, RequestType } from "../proto/apple/geo/GEOPDPlaceRequest.js";
//import { GeoServiceTag_ServiceType } from "../proto/apple/geo/GEOPDAnalyticMetadata.js";
import { ComponentType } from "../proto/apple/geo/GEOPDComponentInfo.js";
export default class GEOPDPlaceRequest {
	static decode(rawBody = new Uint8Array([])) {
		Console.log("☑️ GEOPDPlaceRequest.decode");
		const body = PDPlaceRequest.fromBinary(rawBody);
		if (typeof body?.analyticMetadata?.serviceTag !== "undefined")
			body.analyticMetadata.serviceTag.map(serviceTag => {
				if (typeof serviceTag.serviceType !== "undefined") serviceTag.serviceType = GeoServiceTag_ServiceType[serviceTag.serviceType];
				return serviceTag;
			});
		if (typeof body?.requestedComponents !== "undefined")
			body.requestedComponents.map(requestedComponent => {
				if (typeof requestedComponent.type !== "undefined") requestedComponent.type = ComponentType[requestedComponent.type];
				return requestedComponent;
			});
		if (typeof body.requestType !== "undefined") body.requestType = RequestType[body.requestType];
		Console.log("✅ GEOPDPlaceRequest.decode");
		return body;
	}

	static encode(body = {}) {
		Console.log("☑️ GEOPDPlaceRequest.encode");
		if (typeof body?.analyticMetadata?.serviceTag !== "undefined")
			body.analyticMetadata.serviceTag.map(serviceTag => {
				if (typeof serviceTag.serviceType !== "undefined") serviceTag.serviceType = GeoServiceTag_ServiceType[serviceTag.serviceType];
				return serviceTag;
			});
		if (typeof body?.requestedComponents !== "undefined")
			body.requestedComponents.map(requestedComponent => {
				if (typeof requestedComponent.type !== "undefined") requestedComponent.type = ComponentType[requestedComponent.type];
				return requestedComponent;
			});
		if (typeof body.requestType !== "undefined") body.requestType = RequestType[body.requestType];
		const rawBody = PDPlaceRequest.toBinary(body);
		Console.log("✅ GEOPDPlaceRequest.encode");
		return rawBody;
	}
}
