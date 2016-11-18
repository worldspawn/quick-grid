using System;
using System.ComponentModel;
using Newtonsoft.Json;

namespace QuickGrid
{
    internal sealed class LazyConverter<T> : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var typedValue = (Lazy<T>)value;
            writer.WriteValue(typedValue.Value);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var value = reader.Value;
            return new Lazy<T>(() => (T)TypeDescriptor.GetConverter(typeof(T)).ConvertFrom(value));
        }

        public override bool CanConvert(Type objectType)
        {
            return objectType.GetGenericTypeDefinition() == typeof(Lazy<>);
        }
    }
}