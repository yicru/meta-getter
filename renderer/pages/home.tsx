import React, { useState } from "react";
import { NextPage } from "next";
import {
  Button,
  Center,
  Flex,
  Input,
  useClipboard,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { clipboard, nativeImage } from "electron";
import { getDataUrlFromBlob } from "../lib/utils";

export const Home: NextPage = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [tag, setTag] = useState("");

  const toast = useToast();
  const { hasCopied, onCopy } = useClipboard(tag);

  const handleGet = async () => {
    try {
      setLoading(true);
      const [imgRes, metaRes] = await Promise.all([
        fetch(`/api/image?url=${url}`),
        fetch(`/api/meta?url=${url}`),
      ]);

      const blob = await imgRes.blob();
      const dataUrl = await getDataUrlFromBlob(blob);
      setImage(dataUrl);

      const { title } = await metaRes.json();
      setTag(
        `[sanko href="${url}" title="${title}" site="${url}" target="brank"]`
      );

      clipboard.writeImage(nativeImage.createFromDataURL(dataUrl), "clipboard");
      toast({
        title: "画像をクリップボードにコピーしました",
        status: "success",
      });
    } catch (e) {
      toast({
        title: "エラーが発生しました",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center h="100vh">
      <VStack w="full" maxW="xl" spacing="24px">
        {loading && <p>loading...</p>}
        {image && <img src={image} alt="" />}
        {tag && (
          <Flex w="full">
            <Input value={tag} isReadOnly />
            <Button onClick={onCopy} ml={2}>
              {hasCopied ? "Copied" : "Copy"}
            </Button>
          </Flex>
        )}
        <Flex w="full">
          <Input
            value={url}
            type="text"
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button
            isLoading={loading}
            colorScheme="blue"
            ml={2}
            onClick={handleGet}
          >
            GET
          </Button>
        </Flex>
      </VStack>
    </Center>
  );
};

export default Home;
