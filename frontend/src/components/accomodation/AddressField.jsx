import React from "react";
import Input from "../ui/Input";

export const AddressField = ({ form }) => {
  return (
    <div className="accf-grid-2">
      <form.Field name="address.area">
        {(field) => (
          <Input
            id="address_area"
            type="text"
            label="Area / Neighborhood"
            placeholder="e.g. Anjuna Beach, Bandra West"
            value={field.state.value || ""}
            onChange={(e) => field.handleChange(e.target.value)}
            required
          />
        )}
      </form.Field>

      <form.Field name="address.city">
        {(field) => (
          <Input
            id="address_city"
            type="text"
            label="City"
            placeholder="e.g. North Goa, Mumbai"
            value={field.state.value || ""}
            onChange={(e) => field.handleChange(e.target.value)}
            required
          />
        )}
      </form.Field>

      <form.Field name="address.state">
        {(field) => (
          <Input
            id="address_state"
            type="text"
            label="State"
            placeholder="e.g. Goa, Maharashtra"
            value={field.state.value || ""}
            onChange={(e) => field.handleChange(e.target.value)}
            required
          />
        )}
      </form.Field>

      <form.Field name="address.pincode">
        {(field) => (
          <Input
            id="address_pincode"
            type="number"
            label="Pincode / Postal Code"
            placeholder="e.g. 403509"
            value={field.state.value || ""}
            onChange={(e) => field.handleChange(e.target.value)}
            required
          />
        )}
      </form.Field>
    </div>
  );
};

export default AddressField;
