import argparse
import logging
import re
from datetime import datetime, timezone

import torch
from dotenv import load_dotenv
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, pipeline

load_dotenv("../.env.local")


def summarise(inp: str, model: str) -> str:
    summarizer = pipeline("summarization", model=model)
    res = summarizer(inp, max_length=len(inp) // 2, min_length=30, do_sample=False)
    return res[0]["summary_text"]


def whitespace_handler(s: str) -> str:
    return re.sub("\s+", " ", re.sub("\n+", " ", s.strip()))


def summarise_with_tokenizer(inp: str, model_name: str) -> str:
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

    input_ids = tokenizer(
        [whitespace_handler(inp)],
        return_tensors="pt",
        padding="max_length",
        truncation=True,
        max_length=512,
    )["input_ids"]

    output_ids = model.generate(
        input_ids=input_ids, max_length=84, no_repeat_ngram_size=2, num_beams=4
    )[0]

    summary = tokenizer.decode(
        output_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False
    )

    return summary


def generate_text(inp: str, model: str) -> str:
    generator = pipeline(
        "text-generation",
        model=model,
        model_kwargs={"torch_dtype": torch.bfloat16},
        device_map="auto",
    )
    res = generator(inp, max_new_tokens=len(inp) // 2)
    return res[0]["generated_text"]


def set_up_logger() -> None:
    logging.getLogger().setLevel(logging.INFO)
    log_file = f"logs/{datetime.now(timezone.utc).isoformat()}.log"
    handler = logging.FileHandler(log_file)
    handler.setLevel(logging.INFO)
    logging.getLogger().addHandler(handler)


parser = argparse.ArgumentParser(description="Run LLMs on input files")
parser.add_argument(
    "--summary-models",
    nargs="*",
    help="List of summary models to run",
    default=[
        "Falconsai/text_summarization",
        "facebook/bart-large-cnn",
    ],
)
parser.add_argument(
    "--use-tokeniser",
    action="store_true",
    help="Use tokenizer for summarisation",
    default=False,
)
parser.add_argument(
    "--text-gen-models",
    nargs="*",
    help="List of models to run",
    default=[
        "meta-llama/Meta-Llama-3-8B",
    ],
)
parser.add_argument(
    "--inputs",
    nargs="+",
    help="List of input files to run models on",
    default=["paris_olympics.txt", "test_notes.md"],
)

if __name__ == "__main__":
    set_up_logger()
    args = parser.parse_args()
    logging.info(args)

    inputs = []
    for fname in args.inputs:
        with open(fname, "r") as f:
            content = f.read()
        logging.info(f'Input file "{fname}" contents:')
        logging.info(content)
        inputs.append(content)

    if args.summary_models:
        logging.info("Running summary models")
    for model in args.summary_models:
        for fname, inp in zip(args.inputs, inputs):
            logging.info(f"Running {model} for input file {fname}")
            if args.use_tokeniser:
                summary = summarise_with_tokenizer(inp, model)
            else:
                summary = summarise(inp, model)
            logging.info(summary)

    prompt_prefix = "Summarize the text below, which may be in markdown. Only output the summary.\n---\n"
    if args.text_gen_models:
        logging.info("Running text generation models with the below prompt prefix:")
        logging.info(prompt_prefix)
    for model in args.text_gen_models:
        for fname, inp in zip(args.inputs, inputs):
            logging.info(f"Running {model} for input file {fname}")
            summary = generate_text(prompt_prefix + inp, model)
            logging.info(summary)
